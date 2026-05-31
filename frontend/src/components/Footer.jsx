import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-mark">🛍️</span>
          <span className="brand-name">MRK Store</span>
          <p className="footer-tagline">
            Quality tech & accessories, delivered to your door.
          </p>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/my-orders">My Orders</Link>
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign up</Link>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy</a>
        </div>
      </div>
      <div className="footer-bottom container">
        <span>© {year} MRK Store. All rights reserved.</span>
        <span>Built with React & Express</span>
      </div>
    </footer>
  );
}
