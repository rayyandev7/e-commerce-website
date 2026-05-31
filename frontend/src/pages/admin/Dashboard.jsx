import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import AdminLayout from "../../components/AdminLayout";
import Loader from "../../components/Loader";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get("/analytics")
      .then((data) => active && setStats(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const cards = stats
    ? [
        {
          label: "Revenue",
          value: `$${Number(stats.totalRevenue || 0).toFixed(2)}`,
          icon: "💰",
          tone: "green",
        },
        { label: "Orders", value: stats.totalOrders, icon: "🧾", tone: "blue" },
        {
          label: "Products",
          value: stats.totalProducts,
          icon: "📦",
          tone: "violet",
        },
        { label: "Users", value: stats.totalUsers, icon: "👥", tone: "amber" },
      ]
    : [];

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <Loader label="Loading stats..." />
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <>
          <div className="stat-grid">
            {cards.map((c) => (
              <div key={c.label} className={`stat-card tone-${c.tone}`}>
                <span className="stat-icon">{c.icon}</span>
                <div>
                  <div className="stat-value">{c.value}</div>
                  <div className="stat-label">{c.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="quick-actions">
            <h3>Quick actions</h3>
            <div className="quick-actions-grid">
              <Link to="/admin/products/new" className="quick-action">
                <span>➕</span> Add a product
              </Link>
              <Link to="/admin/products" className="quick-action">
                <span>📦</span> Manage products
              </Link>
              <Link to="/admin/orders" className="quick-action">
                <span>🧾</span> View orders
              </Link>
              <Link to="/admin/users" className="quick-action">
                <span>👥</span> View users
              </Link>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
