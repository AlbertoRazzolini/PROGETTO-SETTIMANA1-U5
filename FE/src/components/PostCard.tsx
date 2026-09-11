import { Link } from "react-router-dom";
import type { PostResp } from "../api/types";
import { formatDate } from "../utils/format";

export function PostCard({ post }: { post: PostResp }) {
  return (
    <Link to={`/posts/${post.id}`} className="card" style={{ display: "block", padding: 18, textDecoration: "none" }}>
      <div className="row-between" style={{ marginBottom: 6 }}>
        <h3 style={{ fontSize: 17 }}>{post.titolo}</h3>
        <span style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
          {formatDate(post.createdAt)}
        </span>
      </div>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: 14,
          marginBottom: post.foto.length || post.poi ? 12 : 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {post.descrizione}
      </p>

      {post.foto.length > 0 && (
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: post.poi ? 10 : 0 }}>
          {post.foto.slice(0, 4).map((f) => (
            <img
              key={f.id}
              src={f.contenuto}
              alt=""
              style={{
                width: 72,
                height: 72,
                objectFit: "cover",
                borderRadius: "var(--radius-sm)",
                flexShrink: 0,
              }}
              onError={(e) => ((e.target as HTMLImageElement).style.visibility = "hidden")}
            />
          ))}
          {post.foto.length > 4 && (
            <span style={{ alignSelf: "center", fontSize: 12, color: "var(--text-muted)" }}>
              +{post.foto.length - 4}
            </span>
          )}
        </div>
      )}

      {post.poi && <span className="badge">📍 {post.poi.indirizzo ?? "Posizione sulla mappa"}</span>}
    </Link>
  );
}
