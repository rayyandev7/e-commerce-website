import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/products", label: "Products", icon: "📦" },
  { to: "/admin/orders", label: "Orders", icon: "🧾" },
  { to: "/admin/users", label: "Users", icon: "👥" },
];

export default function AdminLayout({ title, action, children }) {
  return (
    <div className="container section admin">
      <div className="admin-grid">
        <aside className="admin-sidebar">
          <h2 className="admin-logo">Admin</h2>
          <nav>
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className="admin-nav-link"
              >
                <span className="admin-nav-icon">{l.icon}</span>
                {l.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="admin-content">
          <div className="admin-head">
            <h1>{title}</h1>
            {action}
          </div>
          {children}
        </section>
      </div>
    </div>
  );
}
