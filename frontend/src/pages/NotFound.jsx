import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container section">
      <div className="empty-state large">
        <div className="empty-emoji">🧭</div>
        <h2>404 — Page not found</h2>
        <p className="muted">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </div>
  );
}
