import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { documentiApi } from "../api/documenti";
import type { DocumentoResp } from "../api/types";
import { CameraCapture } from "../components/CameraCapture";
import { EmptyState, ErrorBanner, Loading } from "../components/StatusBanner";
import { formatBytes, formatDate } from "../utils/format";

export function DocumentiPage() {
  const [documenti, setDocumenti] = useState<DocumentoResp[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [titolo, setTitolo] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const filePreview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (filePreview) URL.revokeObjectURL(filePreview); }, [filePreview]);

  function fetchDocumenti() {
    documentiApi
      .getAll()
      .then((data) => setDocumenti(data.sort((a, b) => b.createdAt.localeCompare(a.createdAt))))
      .catch((e) => setError(e instanceof Error ? e.message : "Errore nel caricamento dei documenti"));
  }

  function load() {
    setError(null);
    fetchDocumenti();
  }

  useEffect(fetchDocumenti, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setUploadError(null);
    if (!titolo.trim() || !file) {
      setUploadError("Titolo e immagine sono obbligatori");
      return;
    }
    setUploading(true);
    try {
      const created = await documentiApi.create(titolo.trim(), file);
      setDocumenti((prev) => [created, ...(prev ?? [])]);
      setTitolo("");
      setFile(null);
      setCameraOpen(false);
      (e.target as HTMLFormElement).reset();
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Errore nel caricamento del documento");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="container">
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>Documenti</h1>

      <form onSubmit={handleUpload} className="card" style={{ padding: 20, marginBottom: 24 }}>
        <strong style={{ display: "block", marginBottom: 14 }}>Carica un nuovo documento (OCR automatico)</strong>

        <div className="field">
          <label>Titolo</label>
          <input type="text" value={titolo} onChange={(e) => setTitolo(e.target.value)} />
        </div>

        <div className="field">
          <label>Immagine</label>

          {cameraOpen ? (
            <CameraCapture
              onCapture={(f) => {
                setFile(f);
                setCameraOpen(false);
              }}
              onCancel={() => setCameraOpen(false)}
            />
          ) : (
            <div className="row" style={{ flexWrap: "wrap" }}>
              <label className="btn btn-secondary btn-sm" style={{ cursor: "pointer" }}>
                Scegli file…
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCameraOpen(true)}>
                📸 Fotocamera
              </button>
              {filePreview && (
                <div className="row" style={{ gap: 8 }}>
                  <img
                    src={filePreview}
                    alt=""
                    style={{ width: 48, height: 48, objectFit: "cover", borderRadius: "var(--radius-sm)" }}
                  />
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{file?.name}</span>
                  <button type="button" className="btn btn-sm btn-secondary" onClick={() => setFile(null)}>
                    Rimuovi
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="btn" disabled={uploading} type="submit">
          {uploading ? "Elaborazione OCR…" : "Carica"}
        </button>
        {uploadError && <p className="field-error" style={{ marginTop: 10 }}>{uploadError}</p>}
      </form>

      {error && <ErrorBanner message={error} onRetry={load} />}
      {!error && documenti === null && <Loading label="Caricamento documenti…" />}
      {!error && documenti?.length === 0 && (
        <EmptyState title="Nessun documento" subtitle="Carica un'immagine per estrarne il testo tramite OCR." />
      )}

      {!error && documenti && documenti.length > 0 && (
        <div className="stack">
          {documenti.map((doc) => (
            <Link
              key={doc.id}
              to={`/documenti/${doc.id}`}
              className="card"
              style={{ display: "block", padding: 16, textDecoration: "none" }}
            >
              <div className="row-between">
                <strong>{doc.titolo}</strong>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(doc.createdAt)}</span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  margin: "6px 0 0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {doc.testo ? doc.testo.replace(/\s+/g, " ").trim() : "Nessun testo estratto"}
              </p>
              <span className="badge" style={{ marginTop: 8 }}>
                {formatBytes(doc.grandezza)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
