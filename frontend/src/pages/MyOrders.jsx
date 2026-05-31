import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import Loader from "../components/Loader";

const statusLabel = {
  pending: "Pending",
  shiped: "Shipped",
  deliverd: "Delivered",
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get("/orders/myorders")
      .then((data) => active && setOrders(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  if (loading)
    return (
      <div className="container section">
        <Loader label="Loading your orders..." />
      </div>
    );

  return (
    <div className="container section">
      <div className="page-head">
        <h1>My orders</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!error && orders.length === 0 ? (
        <div className="empty-state large">
          <div className="empty-emoji">📦</div>
          <h2>No orders yet</h2>
          <p className="muted">When you place an order, it'll show up here.</p>
          <Link to="/products" className="btn btn-primary">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card card">
              <div className="order-card-head">
                <div>
                  <span className="muted small">Order ID</span>
                  <div className="order-id">{order._id}</div>
                </div>
                <span className={`status-pill status-${order.status}`}>
                  {statusLabel[order.status] || order.status}
                </span>
              </div>

              <div className="order-card-body">
                <div className="order-meta">
                  <div>
                    <span className="muted small">Items</span>
                    <strong>{order.items?.length || 0}</strong>
                  </div>
                  <div>
                    <span className="muted small">Total</span>
                    <strong>${Number(order.totalAmount).toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="muted small">Ship to</span>
                    <strong>
                      {order.address?.city}, {order.address?.country}
                    </strong>
                  </div>
                </div>

                <ul className="order-items">
                  {order.items?.map((item, idx) => (
                    <li key={idx}>
                      <span>
                        {item.quantity} × ${Number(item.price).toFixed(2)}
                      </span>
                      <span>${(item.quantity * item.price).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
