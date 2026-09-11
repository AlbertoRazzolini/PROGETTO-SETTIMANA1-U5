import { useEffect, useState } from "react";
import { poisApi } from "../api/pois";
import { postsApi } from "../api/posts";
import type { PoiResp, PostResp } from "../api/types";
import { PoiMapView } from "../components/PoiMapView";
import { ErrorBanner, Loading } from "../components/StatusBanner";

export function MapPage() {
  const [pois, setPois] = useState<PoiResp[] | null>(null);
  const [posts, setPosts] = useState<PostResp[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<{ lat: number; lng: number } | null>(null);
  const [indirizzo, setIndirizzo] = useState("");
  const [creating, setCreating] = useState(false);
  const [filtered, setFiltered] = useState(false);

  function fetchMap() {
    Promise.all([poisApi.getAll(), postsApi.getAll()])
      .then(([p, po]) => {
        setPois(p);
        setPosts(po);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Errore nel caricamento della mappa"));
  }

  function load() {
    setError(null);
    fetchMap();
  }

  useEffect(fetchMap, []);

  async function confirmCreate() {
    if (!pending) return;
    setCreating(true);
    try {
      const poi = await poisApi.create({
        latitudine: pending.lat,
        longitudine: pending.lng,
        indirizzo: indirizzo.trim() || null,
      });
      setPois((prev) => [...(prev ?? []), poi]);
      setPending(null);
      setIndirizzo("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore nella creazione del POI");
    } finally {
      setCreating(false);
    }
  }

  async function searchArea(b: { nord: number; sud: number; est: number; ovest: number }) {
    setError(null);
    const found = await poisApi.getByRiquadro(b.nord, b.sud, b.est, b.ovest);
    setPois(found);
    setFiltered(true);
  }

  return (
    <div className="container" style={{ maxWidth: 960 }}>
      <div className="row-between" style={{ marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 26 }}>Mappa</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
            Clicca sulla mappa per aggiungere un nuovo POI, o cerca i punti nell'area visibile.
          </p>
        </div>
        {filtered && (
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => {
              setFiltered(false);
              load();
            }}
          >
            Rimuovi filtro area
          </button>
        )}
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

      {pois === null && !error && <Loading label="Caricamento mappa…" />}

      {pois !== null && (
        <>
          <PoiMapView
            pois={pois}
            posts={posts}
            onCreateAt={(lat, lng) => setPending({ lat, lng })}
            onBoundsSearch={searchArea}
            height={460}
          />

          {pending && (
            <div className="card" style={{ padding: 16, marginTop: 16 }}>
              <strong>Nuovo POI</strong>
              <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 12px" }}>
                {pending.lat.toFixed(5)}, {pending.lng.toFixed(5)}
              </p>
              <div className="row" style={{ flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="Indirizzo (opzionale)"
                  value={indirizzo}
                  onChange={(e) => setIndirizzo(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: 200,
                    padding: "9px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                  }}
                />
                <button className="btn btn-sm" disabled={creating} onClick={confirmCreate}>
                  {creating ? "Creazione…" : "Crea POI"}
                </button>
                <button className="btn btn-sm btn-secondary" onClick={() => setPending(null)}>
                  Annulla
                </button>
              </div>
            </div>
          )}

          {pois.length === 0 && !pending && (
            <p style={{ marginTop: 16, color: "var(--text-muted)", fontSize: 14, textAlign: "center" }}>
              Nessun POI da mostrare. Clicca sulla mappa per crearne uno.
            </p>
          )}
        </>
      )}
    </div>
  );
}
