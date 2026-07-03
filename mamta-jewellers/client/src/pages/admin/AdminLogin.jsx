import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const AdminLogin = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin(form.email, form.password);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 6%" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "var(--color-ink)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-strong)",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
          color: "var(--color-white)",
        }}
      >
        <span className="eyebrow">Store Management</span>
        <h1 style={{ margin: "8px 0 24px", fontSize: "1.5rem", color: "var(--color-white)" }}>Admin Login</h1>

        {error && <p className="error-text">{error}</p>}

        <div className="form-field">
          <label htmlFor="email" style={{ color: "#cbb9ac" }}>Admin ID / Email</label>
          <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-field">
          <label htmlFor="password" style={{ color: "#cbb9ac" }}>Password</label>
          <input id="password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>

        <p style={{ textAlign: "right", margin: "-12px 0 16px", fontSize: "0.85rem" }}>
          <Link to="/forgot-password" style={{ color: "#cbb9ac" }}>Forgot password?</Link>
        </p>

        <button className="btn btn-gold btn-block" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
