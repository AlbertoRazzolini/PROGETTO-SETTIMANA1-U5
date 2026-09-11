import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Feed", end: true },
  { to: "/nuovo-post", label: "Nuovo post" },
  { to: "/mappa", label: "Mappa" },
  { to: "/documenti", label: "Documenti" },
];

export function Navbar() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        className="container"
        style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 24, maxWidth: 900 }}
      >
        <NavLink to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "var(--accent)",
              display: "inline-block",
            }}
          />
          <strong style={{ letterSpacing: "-0.02em" }}>Wandr</strong>
        </NavLink>
        <nav className="row" style={{ gap: 4 }}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              style={({ isActive }) => ({
                padding: "7px 12px",
                borderRadius: 9,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                color: isActive ? "var(--accent)" : "var(--text-muted)",
                background: isActive ? "var(--accent-bg)" : "transparent",
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
