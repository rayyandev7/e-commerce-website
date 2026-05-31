import { useEffect, useState } from "react";
import api from "../../api/api";
import AdminLayout from "../../components/AdminLayout";
import Loader from "../../components/Loader";

const STATUSES = ["pending", "shiped", "deliverd"];
const statusLabel = {
  pending: "Pending",
  shiped: "Shipped",
  deliverd: "Delivered",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get("/orders")
      .then((data) => active && setOrders(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const handleStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const updated = await api.put(`/orders/${orderId}/status`, { status });
      setOrders((list) =>
        list.map((o) => (o._id === orderId ? { ...o, status: updated.status } : o))
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout title="Orders">
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <p>No orders yet.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Ship to</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="mono small">{o._id.slice(-8)}</td>
                  <td>{o.userId?.name || "—"}</td>
                  <td>{o.items?.length || 0}</td>
                  <td>${Number(o.totalAmount).toFixed(2)}</td>
                  <td className="small">
                    {o.address?.city}, {o.address?.country}
                  </td>
                  <td>
                    <select
                      className={`status-select status-${o.status}`}
                      value={o.status}
                      disabled={updatingId === o._id}
                      onChange={(e) => handleStatus(o._id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {statusLabel[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
