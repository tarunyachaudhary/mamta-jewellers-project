import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 6%" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "var(--color-white)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-soft)",
          padding: "40px",
          width: "100%",
          maxWidth: "440px",
        }}
      >
        <span className="eyebrow">Join Mamta Jewellers</span>
        <h1 style={{ margin: "8px 0 24px", fontSize: "1.6rem" }}>Create Account</h1>

        {error && <p className="error-text">{error}</p>}

        <div className="form-field">
          <label htmlFor="name">Full Name</label>
          <input id="name" name="name" required value={form.name} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required minLength={6} value={form.password} onChange={handleChange} />
        </div>

        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p style={{ marginTop: 14, fontSize: "0.88rem", color: "var(--color-ink-soft)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--color-crimson)", fontWeight: 600 }}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
