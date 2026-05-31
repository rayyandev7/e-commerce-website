import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError } from "../features/auth/authSlice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setLocalError(null);
    if (form.password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setLocalError("Passwords do not match.");
      return;
    }
    dispatch(
      register({
        name: form.name,
        email: form.email,
        password: form.password,
      })
    );
  };

  return (
    <div className="auth-page container">
      <div className="auth-card card">
        <h1>Create your account</h1>
        <p className="muted">Join MRK Store in seconds.</p>

        {(localError || error) && (
          <div className="alert alert-error">{localError || error}</div>
        )}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Full name</label>
            <input
              className="input"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Jane Doe"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              className="input"
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              className="input"
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="At least 6 characters"
              required
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label>Confirm password</label>
            <input
              className="input"
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={onChange}
              placeholder="Re-enter password"
              required
              autoComplete="new-password"
            />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
