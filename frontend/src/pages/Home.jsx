import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get("/products")
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const featured = products.slice(0, 4);
  const categories = [...new Set(products.map((p) => p.category))].slice(0, 4);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="hero-eyebrow">New season · Free shipping over $50</span>
            <h1 className="hero-title">
              Gear up with <span className="accent">MRK Store</span>
            </h1>
            <p className="hero-sub">
              Hand-picked electronics and accessories at honest prices. Fast
              delivery, easy returns, and a checkout that just works.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop now
              </Link>
              <Link to="/register" className="btn btn-ghost btn-lg">
                Create account
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <strong>{products.length || "—"}</strong>
                <span>Products</span>
              </div>
              <div>
                <strong>4.8★</strong>
                <span>Avg. rating</span>
              </div>
              <div>
                <strong>24h</strong>
                <span>Dispatch</span>
              </div>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-blob" />
            <div className="hero-card hero-card-1">🎧</div>
            <div className="hero-card hero-card-2">⌨️</div>
            <div className="hero-card hero-card-3">🖱️</div>
          </div>
        </div>
      </section>

      {/* Category chips */}
      {categories.length > 0 && (
        <section className="container section">
          <div className="category-chips">
            {categories.map((c) => (
              <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} className="chip">
                {c}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      <section className="container section">
        <div className="section-head">
          <h2>Featured products</h2>
          <Link to="/products" className="link-arrow">
            View all →
          </Link>
        </div>

        {loading ? (
          <Loader label="Loading products..." />
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : featured.length === 0 ? (
          <div className="empty-state">
            <p>No products yet. Check back soon!</p>
          </div>
        ) : (
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Value props */}
      <section className="container section">
        <div className="value-props">
          <div className="value-prop">
            <span className="value-icon">🚚</span>
            <h3>Fast delivery</h3>
            <p>Orders dispatched within 24 hours.</p>
          </div>
          <div className="value-prop">
            <span className="value-icon">🔒</span>
            <h3>Secure checkout</h3>
            <p>Your data is encrypted and protected.</p>
          </div>
          <div className="value-prop">
            <span className="value-icon">↩️</span>
            <h3>Easy returns</h3>
            <p>30-day hassle-free return policy.</p>
          </div>
          <div className="value-prop">
            <span className="value-icon">💬</span>
            <h3>24/7 support</h3>
            <p>We're here whenever you need us.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
