import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../api/api";
import AdminLayout from "../../components/AdminLayout";
import Loader from "../../components/Loader";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    api
      .get(`/products/${id}`)
      .then((p) => {
        if (!active) return;
        setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price ?? "",
          category: p.category || "",
          stock: p.stock ?? "",
        });
        setPreview(p.imageUrl || null);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id, isEdit]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onFile = (e) => {
    const file = e.target.files[0];
    setImageFile(file || null);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isEdit && !imageFile) {
      setError("Please upload a product image.");
      return;
    }

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("category", form.category);
    data.append("stock", form.stock);
    if (imageFile) data.append("image", imageFile);

    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/products/${id}`, data, { isForm: true });
      } else {
        await api.post("/products", data, { isForm: true });
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title={isEdit ? "Edit product" : "Add product"}>
      <Link to="/admin/products" className="link-arrow">
        ← Back to products
      </Link>

      {loading ? (
        <Loader />
      ) : (
        <form className="card product-form" onSubmit={onSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label>Name</label>
            <input
              className="input"
              name="name"
              value={form.name}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="input"
              name="description"
              rows={4}
              value={form.description}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($)</label>
              <input
                className="input"
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={form.price}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                className="input"
                type="number"
                min="0"
                name="stock"
                value={form.stock}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              className="input"
              name="category"
              value={form.category}
              onChange={onChange}
              placeholder="e.g. Electronics"
              required
            />
          </div>

          <div className="form-group">
            <label>
              Product image {isEdit && <span className="muted">(leave empty to keep current)</span>}
            </label>
            <input
              className="input"
              type="file"
              accept="image/*"
              onChange={onFile}
            />
            {preview && (
              <img className="image-preview" src={preview} alt="Preview" />
            )}
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Save changes" : "Create product"}
            </button>
            <Link to="/admin/products" className="btn btn-ghost">
              Cancel
            </Link>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
