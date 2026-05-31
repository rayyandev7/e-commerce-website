import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../features/cart/cartSlice";

const placeholder =
  "https://placehold.co/120x120/eef2ff/6366f1?text=Item";

export default function Cart() {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const shipping = total > 50 || total === 0 ? 0 : 5.99;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="container section">
        <div className="empty-state large">
          <div className="empty-emoji">🛒</div>
          <h2>Your cart is empty</h2>
          <p className="muted">Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn btn-primary">
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  const goCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="container section">
      <div className="page-head">
        <h1>Your cart</h1>
        <button className="btn btn-ghost btn-sm" onClick={() => dispatch(clearCart())}>
          Clear cart
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.productId} className="cart-item">
              <Link to={`/products/${item.productId}`} className="cart-item-img">
                <img
                  src={item.imageUrl || placeholder}
                  alt={item.name}
                  onError={(e) => (e.currentTarget.src = placeholder)}
                />
              </Link>
              <div className="cart-item-info">
                <Link to={`/products/${item.productId}`} className="cart-item-name">
                  {item.name}
                </Link>
                <span className="muted small">
                  ${Number(item.price).toFixed(2)} each
                </span>
              </div>

              <div className="qty-control">
                <button
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        productId: item.productId,
                        quantity: item.quantity - 1,
                      })
                    )
                  }
                  aria-label="Decrease"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        productId: item.productId,
                        quantity: item.quantity + 1,
                      })
                    )
                  }
                  aria-label="Increase"
                >
                  +
                </button>
              </div>

              <div className="cart-item-subtotal">
                ${(item.price * item.quantity).toFixed(2)}
              </div>

              <button
                className="cart-item-remove"
                onClick={() => dispatch(removeFromCart(item.productId))}
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h3>Order summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          {shipping > 0 && (
            <p className="muted small">
              Add ${(50 - total).toFixed(2)} more for free shipping.
            </p>
          )}
          <div className="summary-row total">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary btn-block" onClick={goCheckout}>
            Proceed to checkout
          </button>
          <Link to="/products" className="link-arrow center">
            ← Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
