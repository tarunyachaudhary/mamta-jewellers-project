import { useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./Login.module.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      const redirectTo = searchParams.get("redirect") || location.state?.from || "/";
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.card}>
        <span className="eyebrow">Welcome Back</span>
        <h1>Customer Login</h1>

        {error && <p className="error-text">{error}</p>}

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <p className={styles.forgotLink}>
          <Link to="/forgot-password">Forgot password?</Link>
        </p>

        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className={styles.switch}>
          New here? <Link to="/register">Create an account</Link>
        </p>
        <p className={styles.switch}>
          <Link to="/admin/login">Admin login &rarr;</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;