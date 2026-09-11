import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { documentiApi } from "../api/documenti";
import type { DocumentoResp } from "../api/types";
import { ErrorBanner, Loading } from "../components/StatusBanner";
import { formatBytes, formatDate } from "../utils/format";

export function DocumentoDetailPage() {
  const { documentoId } = useParams<{ documentoId: string }>();
  const navigate = useNavigate();

  const [doc, setDoc] = useState<DocumentoResp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [titolo, setTitolo] = useState("");
  const [testo, setTesto] = useState("");
  const [saving, setSaving] = useState(false);

  function fetchDoc() {
    if (!documentoId) return;
    documentiApi
      .getById(documentoId)
      .then((d) => {
        setDoc(d);
        setTitolo(d.titolo);
        setTesto(d.testo ?? "");
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Documento non trovato"));
  }

  function load() {
    setError(null);
    fetchDoc();
  }

  useEffect(fetchDoc, [documentoId]);

  async function saveEdits() {
    if (!doc) return;
    setSaving(true);
    try {
      const updated = await documentiApi.update(doc.id, { titolo, testo });
      setDoc(updated);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore nel salvataggio");
    } finally {
      setSaving(false);
    }
  }

  async function deleteDoc() {
    if (!doc) return;
    if (!confirm("Eliminare definitivamente questo documento?")) return;
    await documentiApi.delete(doc.id);
    navigate("/documenti");
  }

  if (error) {
    return (
      <div className="container">
        <ErrorBanner message={error} onRetry={load} />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="container">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 680 }}>
      <div className="card" style={{ padding: 24 }}>
        {editing ? (
          <div className="stack">
            <div className="field">
              <label>Titolo</label>
              <input type="text" value={titolo} onChange={(e) => setTitolo(e.target.value)} />
            </div>
            <div className="field">
              <label>Testo estratto (OCR)</label>
              <textarea value={testo} onChange={(e) => setTesto(e.target.value)} rows={10} />
            </div>
            <div className="row">
              <button className="btn btn-sm" disabled={saving} onClick={saveEdits}>
                {saving ? "Salvataggio…" : "Salva"}
              </button>
              <button className="btn btn-sm btn-secondary" onClick={() => setEditing(false)}>
                Annulla
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="row-between" style={{ marginBottom: 6, alignItems: "flex-start" }}>
              <h1 style={{ fontSize: 24 }}>{doc.titolo}</h1>
              <div className="row" style={{ gap: 6 }}>
                <button className="btn btn-sm btn-secondary" onClick={() => setEditing(true)}>
                  Modifica
                </button>
                <button className="btn btn-sm btn-danger" onClick={deleteDoc}>
                  Elimina
                </button>
              </div>
            </div>
            <div className="row" style={{ gap: 10, marginBottom: 18 }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(doc.createdAt)}</span>
              <span className="badge">{formatBytes(doc.grandezza)}</span>
            </div>
            <strong style={{ display: "block", marginBottom: 8, fontSize: 13, color: "var(--text-muted)" }}>
              Testo estratto (OCR)
            </strong>
            <p
              style={{
                whiteSpace: "pre-wrap",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: 14,
                fontFamily: "ui-monospace, Consolas, monospace",
                fontSize: 13,
                minHeight: 80,
              }}
            >
              {doc.testo?.trim() || "Nessun testo riconosciuto in questa immagine."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
