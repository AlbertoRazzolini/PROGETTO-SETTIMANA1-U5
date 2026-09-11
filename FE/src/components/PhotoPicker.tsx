import { useState } from "react";
import type { NewFotoInPost } from "../api/types";
import { CameraCapture } from "./CameraCapture";
import { fileToDataUrl, formatBytes } from "../utils/format";

interface Props {
  photos: NewFotoInPost[];
  onChange: (photos: NewFotoInPost[]) => void;
}

/**
 * L'API salva le foto come coppia (url, dimensione): non esiste un endpoint di
 * upload binario per le foto dei post. Per i file locali (o scattati con la
 * fotocamera) generiamo quindi una data URL lato client, inviata come se
 * fosse l'url della foto.
 */
export function PhotoPicker({ photos, onChange }: Props) {
  const [urlDraft, setUrlDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  async function addFile(file: File) {
    const dataUrl = await fileToDataUrl(file);
    onChange([...photos, { contenuto: dataUrl, grandezza: file.size }]);
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        await addFile(file);
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleCapture(file: File) {
    setCameraOpen(false);
    setBusy(true);
    try {
      await addFile(file);
    } finally {
      setBusy(false);
    }
  }

  function addUrl() {
    const url = urlDraft.trim();
    if (!url) return;
    onChange([...photos, { contenuto: url, grandezza: 0 }]);
    setUrlDraft("");
  }

  function remove(index: number) {
    onChange(photos.filter((_, i) => i !== index));
  }

  return (
    <div className="stack">
      {cameraOpen ? (
        <CameraCapture onCapture={handleCapture} onCancel={() => setCameraOpen(false)} />
      ) : (
        <div className="row" style={{ flexWrap: "wrap" }}>
          <label className="btn btn-secondary btn-sm" style={{ cursor: "pointer" }}>
            {busy ? "Caricamento…" : "Scegli file…"}
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              disabled={busy}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={busy}
            onClick={() => setCameraOpen(true)}
          >
            📸 Fotocamera
          </button>
          <input
            type="text"
            placeholder="…oppure incolla un URL immagine"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            style={{
              flex: 1,
              minWidth: 180,
              padding: "8px 12px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              background: "var(--surface)",
            }}
          />
          <button type="button" className="btn btn-sm btn-secondary" onClick={addUrl}>
            Aggiungi URL
          </button>
        </div>
      )}

      {photos.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {photos.map((photo, i) => (
            <div
              key={i}
              className="card"
              style={{ position: "relative", width: 96, padding: 0, overflow: "hidden" }}
            >
              <img
                src={photo.contenuto}
                alt=""
                style={{ width: "100%", height: 72, objectFit: "cover", display: "block" }}
                onError={(e) => ((e.target as HTMLImageElement).style.opacity = "0.2")}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                title="Rimuovi"
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 20,
                  height: 20,
                  lineHeight: "18px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                ×
              </button>
              {photo.grandezza > 0 && (
                <span
                  style={{
                    display: "block",
                    fontSize: 10,
                    textAlign: "center",
                    color: "var(--text-muted)",
                    padding: "2px 0",
                  }}
                >
                  {formatBytes(photo.grandezza)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
