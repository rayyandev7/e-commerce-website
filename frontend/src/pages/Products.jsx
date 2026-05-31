import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";

  useEffect(() => {
    let active = true;
    api
      .get("/products")
      .then((data) => active && setProducts(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const visible = useMemo(() => {
    let list = [...products];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    if (category) list = list.filter((p) => p.category === category);

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
    }
    return list;
  }, [products, search, category, sort]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="container section">
      <div className="page-head">
        <div>
          <h1>Shop all products</h1>
          <p className="muted">
            {loading ? "—" : `${visible.length} item${visible.length === 1 ? "" : "s"}`}
            {category ? ` in ${category}` : ""}
          </p>
        </div>
      </div>

      <div className="shop-toolbar">
        <input
          type="search"
          className="input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setParam("search", e.target.value)}
        />
        <select
          className="input"
          value={category}
          onChange={(e) => setParam("category", e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={sort}
          onChange={(e) => setParam("sort", e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A–Z</option>
        </select>
      </div>

      {loading ? (
        <Loader label="Loading products..." />
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : visible.length === 0 ? (
        <div className="empty-state">
          <p>No products match your filters.</p>
          <button className="btn btn-ghost" onClick={() => setSearchParams({})}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {visible.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
