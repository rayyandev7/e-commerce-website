import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// Requires a logged-in user.
export default function ProtectedRoute() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

// Requires a logged-in user with the admin role.
export function AdminRoute() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
