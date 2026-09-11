import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fotosApi } from "../api/fotos";
import { postsApi } from "../api/posts";
import type { NewFotoInPost, PostResp } from "../api/types";
import { LocationPickerMap } from "../components/LocationPickerMap";
import { PhotoPicker } from "../components/PhotoPicker";
import { ErrorBanner, Loading } from "../components/StatusBanner";
import { formatBytes, formatDate } from "../utils/format";

export function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<PostResp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [saving, setSaving] = useState(false);
  const [addingPhotos, setAddingPhotos] = useState(false);
  const [newPhotos, setNewPhotos] = useState<NewFotoInPost[]>([]);

  function fetchPost() {
    if (!postId) return;
    postsApi
      .getById(postId)
      .then((p) => {
        setPost(p);
        setTitolo(p.titolo);
        setDescrizione(p.descrizione);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Post non trovato"));
  }

  function load() {
    setError(null);
    fetchPost();
  }

  useEffect(fetchPost, [postId]);

  async function saveEdits() {
    if (!post) return;
    setSaving(true);
    try {
      const updated = await postsApi.update(post.id, { titolo, descrizione });
      setPost(updated);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore nel salvataggio");
    } finally {
      setSaving(false);
    }
  }

  async function deletePost() {
    if (!post) return;
    if (!confirm("Eliminare definitivamente questo post e le sue foto?")) return;
    await postsApi.delete(post.id);
    navigate("/");
  }

  async function deletePhoto(fotoId: string) {
    if (!post) return;
    await fotosApi.delete(fotoId);
    setPost({ ...post, foto: post.foto.filter((f) => f.id !== fotoId) });
  }

  async function confirmNewPhotos() {
    if (!post || newPhotos.length === 0) return;
    setSaving(true);
    try {
      const created = await Promise.all(
        newPhotos.map((p) => fotosApi.create({ ...p, postId: post.id }))
      );
      setPost({ ...post, foto: [...post.foto, ...created] });
      setNewPhotos([]);
      setAddingPhotos(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore nell'aggiunta delle foto");
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <div className="container">
        <ErrorBanner message={error} onRetry={load} />
      </div>
    );
  }

  if (!post) {
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
              <label>Descrizione</label>
              <textarea value={descrizione} onChange={(e) => setDescrizione(e.target.value)} rows={4} />
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
              <h1 style={{ fontSize: 24 }}>{post.titolo}</h1>
              <div className="row" style={{ gap: 6 }}>
                <button className="btn btn-sm btn-secondary" onClick={() => setEditing(true)}>
                  Modifica
                </button>
                <button className="btn btn-sm btn-danger" onClick={deletePost}>
                  Elimina
                </button>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
              Pubblicato il {formatDate(post.createdAt)}
            </p>
            <p style={{ whiteSpace: "pre-wrap" }}>{post.descrizione}</p>
          </>
        )}
      </div>

      {post.poi && (
        <div className="card" style={{ padding: 16, marginTop: 16 }}>
          <div className="row-between" style={{ marginBottom: 10 }}>
            <strong>📍 {post.poi.indirizzo ?? "Posizione"}</strong>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {Number(post.poi.latitudine).toFixed(5)}, {Number(post.poi.longitudine).toFixed(5)}
            </span>
          </div>
          <LocationPickerMap
            position={{ lat: Number(post.poi.latitudine), lng: Number(post.poi.longitudine) }}
            onPick={() => {}}
            height={220}
          />
        </div>
      )}

      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        <div className="row-between" style={{ marginBottom: 12 }}>
          <strong>Foto ({post.foto.length})</strong>
          <button className="btn btn-sm btn-secondary" onClick={() => setAddingPhotos((v) => !v)}>
            {addingPhotos ? "Chiudi" : "+ Aggiungi foto"}
          </button>
        </div>

        {addingPhotos && (
          <div className="stack" style={{ marginBottom: 16 }}>
            <PhotoPicker photos={newPhotos} onChange={setNewPhotos} />
            <button
              className="btn btn-sm"
              disabled={newPhotos.length === 0 || saving}
              onClick={confirmNewPhotos}
              style={{ alignSelf: "flex-start" }}
            >
              {saving ? "Caricamento…" : `Salva ${newPhotos.length || ""} foto`}
            </button>
          </div>
        )}

        {post.foto.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Nessuna foto in questo post.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
            {post.foto.map((f) => (
              <div key={f.id} className="card" style={{ padding: 0, overflow: "hidden", position: "relative" }}>
                <img
                  src={f.contenuto}
                  alt=""
                  style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }}
                  onError={(e) => ((e.target as HTMLImageElement).style.opacity = "0.15")}
                />
                <div className="row-between" style={{ padding: "6px 8px" }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {f.grandezza > 0 ? formatBytes(f.grandezza) : ""}
                  </span>
                  <button
                    onClick={() => deletePhoto(f.id)}
                    style={{ border: "none", background: "none", color: "var(--danger)", cursor: "pointer", fontSize: 11 }}
                  >
                    Elimina
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
