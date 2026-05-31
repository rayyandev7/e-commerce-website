import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import AdminLayout from "../../components/AdminLayout";
import Loader from "../../components/Loader";

const placeholder = "https://placehold.co/80x80/eef2ff/6366f1?text=—";

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get("/products")
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.del(`/products/${id}`);
      setProducts((list) => list.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout
      title="Products"
      action={
        <Link to="/admin/products/new" className="btn btn-primary btn-sm">
          ➕ Add product
        </Link>
      }
    >
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p>No products yet.</p>
          <Link to="/admin/products/new" className="btn btn-primary">
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="ta-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="cell-product">
                      <img
                        src={p.imageUrl || placeholder}
                        alt={p.name}
                        onError={(e) => (e.currentTarget.src = placeholder)}
                      />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>${Number(p.price).toFixed(2)}</td>
                  <td>
                    <span className={p.stock <= 0 ? "text-danger" : ""}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="ta-right">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => navigate(`/admin/products/${p._id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger-ghost btn-sm"
                      onClick={() => handleDelete(p._id, p.name)}
                      disabled={deletingId === p._id}
                    >
                      {deletingId === p._id ? "..." : "Delete"}
                    </button>
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
