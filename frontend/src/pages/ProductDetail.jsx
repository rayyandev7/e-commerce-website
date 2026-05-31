import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/api";
import Loader from "../components/Loader";
import { addToCart, selectCartItems } from "../features/cart/cartSlice";

const placeholder =
  "https://placehold.co/600x500/eef2ff/6366f1?text=No+Image";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((data) => active && setProduct(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <div className="container section"><Loader /></div>;
  if (error)
    return (
      <div className="container section">
        <div className="alert alert-error">{error}</div>
        <Link to="/products" className="btn btn-ghost">← Back to shop</Link>
      </div>
    );
  if (!product) return null;

  const inCart = cartItems.find((i) => i.productId === product._id);
  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
        quantity: qty,
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const buyNow = () => {
    handleAdd();
    navigate("/cart");
  };

  return (
    <div className="container section">
      <nav className="breadcrumb">
        <Link to="/">Home</Link> <span>/</span>{" "}
        <Link to="/products">Shop</Link> <span>/</span>{" "}
        <span className="current">{product.name}</span>
      </nav>

      <div className="product-detail">
        <div className="product-detail-media">
          <img
            src={product.imageUrl || placeholder}
            alt={product.name}
            onError={(e) => (e.currentTarget.src = placeholder)}
          />
        </div>

        <div className="product-detail-info">
          {product.category && (
            <span className="badge badge-category-static">{product.category}</span>
          )}
          <h1>{product.name}</h1>

          <div className="rating-row">
            <span className="stars">
              {"★".repeat(Math.round(product.rating || 0)).padEnd(5, "☆")}
            </span>
            <span className="muted">
              {product.rating || 0} ({product.numReviews || 0} reviews)
            </span>
          </div>

          <p className="product-detail-price">
            ${Number(product.price).toFixed(2)}
          </p>

          <p className="product-detail-desc">{product.description}</p>

          <div className="stock-row">
            {outOfStock ? (
              <span className="stock-pill out">Out of stock</span>
            ) : (
              <span className="stock-pill in">
                In stock · {product.stock} available
              </span>
            )}
          </div>

          {!outOfStock && (
            <div className="purchase-row">
              <div className="qty-control">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease"
                >
                  −
                </button>
                <span>{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
              <button className="btn btn-primary" onClick={handleAdd}>
                {added ? "✓ Added!" : "Add to cart"}
              </button>
              <button className="btn btn-dark" onClick={buyNow}>
                Buy now
              </button>
            </div>
          )}

          {inCart && (
            <p className="muted small">
              {inCart.quantity} already in your cart ·{" "}
              <Link to="/cart">View cart</Link>
            </p>
          )}

          <ul className="product-perks">
            <li>🚚 Free shipping on orders over $50</li>
            <li>↩️ 30-day return policy</li>
            <li>🔒 Secure checkout</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
