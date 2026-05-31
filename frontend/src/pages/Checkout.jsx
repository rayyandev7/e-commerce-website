import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/api";
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from "../features/cart/cartSlice";

export default function Checkout() {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();

  const shipping = total > 50 || total === 0 ? 0 : 5.99;
  const grandTotal = total + shipping;

  const [address, setAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const onChange = (e) =>
    setAddress((a) => ({ ...a, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPlacing(true);
    try {
      const order = await api.post("/orders", {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
        totalAmount: Number(grandTotal.toFixed(2)),
        address,
      });
      dispatch(clearCart());
      setSuccess(order);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (success) {
    return (
      <div className="container section">
        <div className="empty-state large">
          <div className="empty-emoji">🎉</div>
          <h2>Order placed!</h2>
          <p className="muted">
            Thank you for your purchase. Your order ID is{" "}
            <strong>{success._id}</strong>.
          </p>
          <div className="success-actions">
            <Link to="/my-orders" className="btn btn-primary">
              View my orders
            </Link>
            <Link to="/products" className="btn btn-ghost">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container section">
        <div className="empty-state large">
          <div className="empty-emoji">🛒</div>
          <h2>Nothing to check out</h2>
          <p className="muted">Your cart is empty.</p>
          <Link to="/products" className="btn btn-primary">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="page-head">
        <h1>Checkout</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="checkout-layout">
        <form className="checkout-form card" onSubmit={handleSubmit}>
          <h3>Shipping address</h3>
          <div className="form-group">
            <label>Street address</label>
            <input
              className="input"
              name="street"
              value={address.street}
              onChange={onChange}
              placeholder="123 Main Street"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                className="input"
                name="city"
                value={address.city}
                onChange={onChange}
                placeholder="New York"
                required
              />
            </div>
            <div className="form-group">
              <label>Postal code</label>
              <input
                className="input"
                name="postalCode"
                value={address.postalCode}
                onChange={onChange}
                placeholder="10001"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              className="input"
              name="country"
              value={address.country}
              onChange={onChange}
              placeholder="USA"
              required
            />
          </div>

          <h3 className="mt">Payment</h3>
          <div className="payment-note">
            💳 This is a demo store — no real payment is processed. Click below
            to place your order.
          </div>

          <button className="btn btn-primary btn-block" disabled={placing}>
            {placing ? "Placing order..." : `Place order · $${grandTotal.toFixed(2)}`}
          </button>
        </form>

        <aside className="cart-summary">
          <h3>Order summary</h3>
          <div className="checkout-items">
            {items.map((i) => (
              <div key={i.productId} className="checkout-item">
                <span className="checkout-item-qty">{i.quantity}×</span>
                <span className="checkout-item-name">{i.name}</span>
                <span>${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
