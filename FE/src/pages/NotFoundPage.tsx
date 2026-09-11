import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="container" style={{ textAlign: "center", paddingTop: 80 }}>
      <h1 style={{ fontSize: 40, marginBottom: 12 }}>404</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>Pagina non trovata.</p>
      <Link to="/" className="btn">
        Torna al feed
      </Link>
    </div>
  );
}
