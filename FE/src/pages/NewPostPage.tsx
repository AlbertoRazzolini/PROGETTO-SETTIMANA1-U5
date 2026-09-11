import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postsApi } from "../api/posts";
import type { NewFotoInPost } from "../api/types";
import { PhotoPicker } from "../components/PhotoPicker";
import { PoiPicker } from "../components/PoiPicker";

export function NewPostPage() {
  const navigate = useNavigate();
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [poiId, setPoiId] = useState<string | null>(null);
  const [foto, setFoto] = useState<NewFotoInPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!titolo.trim() || !descrizione.trim()) {
      setError("Titolo e descrizione sono obbligatori");
      return;
    }
    setSaving(true);
    try {
      const post = await postsApi.create({
        titolo: titolo.trim(),
        descrizione: descrizione.trim(),
        poiId,
        foto,
      });
      navigate(`/posts/${post.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore nella creazione del post");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 620 }}>
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>Nuovo post</h1>

      <form onSubmit={handleSubmit} className="card" style={{ padding: 24 }}>
        <div className="field">
          <label>Titolo</label>
          <input type="text" value={titolo} onChange={(e) => setTitolo(e.target.value)} maxLength={200} />
        </div>

        <div className="field">
          <label>Descrizione</label>
          <textarea value={descrizione} onChange={(e) => setDescrizione(e.target.value)} rows={4} />
        </div>

        <div className="field">
          <label>Posizione</label>
          <PoiPicker value={poiId} onChange={setPoiId} />
        </div>

        <div className="field">
          <label>Foto</label>
          <PhotoPicker photos={foto} onChange={setFoto} />
        </div>

        {error && <p className="field-error" style={{ marginBottom: 12 }}>{error}</p>}

        <button type="submit" className="btn" disabled={saving}>
          {saving ? "Pubblicazione…" : "Pubblica post"}
        </button>
      </form>
    </div>
  );
}
