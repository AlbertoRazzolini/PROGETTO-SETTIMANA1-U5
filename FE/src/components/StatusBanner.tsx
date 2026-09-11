export function Loading({ label = "Caricamento…" }: { label?: string }) {
  return (
    <div className="row" style={{ padding: 24, justifyContent: "center", color: "var(--text-muted)" }}>
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      className="card row-between"
      style={{ padding: 16, borderColor: "var(--danger)", background: "var(--danger-bg)" }}
    >
      <span style={{ color: "var(--danger)" }}>{message}</span>
      {onRetry && (
        <button className="btn btn-sm btn-secondary" onClick={onRetry}>
          Riprova
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="card" style={{ padding: "40px 24px", textAlign: "center" }}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{title}</p>
      {subtitle && <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{subtitle}</p>}
    </div>
  );
}
