import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { selectCartCount } from "../features/cart/cartSlice";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-mark">🛍️</span>
          <span className="brand-name">MRK Store</span>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" end className="nav-link" onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/products" className="nav-link" onClick={closeMenu}>
            Shop
          </NavLink>

          {user && (
            <NavLink to="/my-orders" className="nav-link" onClick={closeMenu}>
              My Orders
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink to="/admin" className="nav-link" onClick={closeMenu}>
              Admin
            </NavLink>
          )}

          <NavLink to="/cart" className="nav-link cart-link" onClick={closeMenu}>
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>

          {user ? (
            <div className="nav-user">
              <span className="nav-greeting">Hi, {user.name?.split(" ")[0]}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-ghost btn-sm" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
