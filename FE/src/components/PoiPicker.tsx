import { useEffect, useState } from "react";
import { poisApi } from "../api/pois";
import type { PoiResp } from "../api/types";
import { LocationPickerMap } from "./LocationPickerMap";

interface Props {
  value: string | null;
  onChange: (poiId: string | null) => void;
}

export function PoiPicker({ value, onChange }: Props) {
  const [pois, setPois] = useState<PoiResp[]>([]);
  const [mode, setMode] = useState<"nessuna" | "esistente" | "nuova">("nessuna");
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [indirizzo, setIndirizzo] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    poisApi.getAll().then(setPois).catch(() => setPois([]));
  }, []);

  async function confirmNewPoi() {
    if (!position) return;
    setCreating(true);
    setError(null);
    try {
      const poi = await poisApi.create({
        latitudine: position.lat,
        longitudine: position.lng,
        indirizzo: indirizzo.trim() || null,
      });
      setPois((prev) => [...prev, poi]);
      onChange(poi.id);
      setMode("esistente");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore nella creazione del POI");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="stack">
      <div className="row" style={{ gap: 8 }}>
        {(["nessuna", "esistente", "nuova"] as const).map((m) => (
          <button
            key={m}
            type="button"
            className={`btn btn-sm ${mode === m ? "" : "btn-secondary"}`}
            onClick={() => {
              setMode(m);
              if (m === "nessuna") onChange(null);
            }}
          >
            {m === "nessuna" && "Nessuna posizione"}
            {m === "esistente" && "POI esistente"}
            {m === "nuova" && "Nuovo POI"}
          </button>
        ))}
      </div>

      {mode === "esistente" && (
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
          style={{
            padding: "9px 12px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border)",
            background: "var(--surface)",
          }}
        >
          <option value="">Seleziona un POI…</option>
          {pois.map((poi) => (
            <option key={poi.id} value={poi.id}>
              {poi.indirizzo ?? `${Number(poi.latitudine).toFixed(4)}, ${Number(poi.longitudine).toFixed(4)}`}
            </option>
          ))}
        </select>
      )}

      {mode === "nuova" && (
        <div className="stack">
          <p className="field-hint">Clicca sulla mappa per posizionare il punto</p>
          <LocationPickerMap position={position} onPick={(lat, lng) => setPosition({ lat, lng })} />
          <input
            type="text"
            placeholder="Indirizzo (opzionale)"
            value={indirizzo}
            onChange={(e) => setIndirizzo(e.target.value)}
            style={{
              padding: "9px 12px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              background: "var(--surface)",
            }}
          />
          {error && <span className="field-error">{error}</span>}
          <button
            type="button"
            className="btn btn-sm"
            disabled={!position || creating}
            onClick={confirmNewPoi}
            style={{ alignSelf: "flex-start" }}
          >
            {creating ? "Creazione…" : "Crea e collega POI"}
          </button>
        </div>
      )}
    </div>
  );
}
