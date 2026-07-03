import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "./Login/Login.module.css";

const ForgotPassword = () => {
    const { verifyOtp } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState("email"); // "email" | "otp"
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);
        try {
            const { data } = await api.post("/auth/forgot-password", { email });
            setMessage(data.message);
            setStep("otp");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await verifyOtp(email, otp);
            navigate(data.role === "admin" ? "/admin" : "/");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid or expired OTP.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <form onSubmit={step === "email" ? handleSendOtp : handleVerifyOtp} className={styles.card}>
                <span className="eyebrow">Account Recovery</span>
                <h1>{step === "email" ? "Forgot Password" : "Enter OTP"}</h1>

                {message && <p className="success-text">{message}</p>}
                {error && <p className="error-text">{error}</p>}

                {step === "email" ? (
                    <div className="form-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                ) : (
                    <div className="form-field">
                        <label htmlFor="otp">6-Digit OTP</label>
                        <input
                            id="otp"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            placeholder="123456"
                        />
                    </div>
                )}

                <button className="btn btn-primary btn-block" disabled={loading}>
                    {loading
                        ? step === "email" ? "Sending..." : "Verifying..."
                        : step === "email" ? "Send OTP" : "Verify & Login"}
                </button>

                {step === "otp" && (
                    <p className={styles.switch}>
                        <button
                            type="button"
                            onClick={() => setStep("email")}
                            style={{ background: "none", border: "none", color: "#8B1E3F", cursor: "pointer", textDecoration: "underline" }}
                        >
                            Use a different email
                        </button>
                    </p>
                )}

                <p className={styles.switch}>
                    <Link to="/login">&larr; Back to login</Link>
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;