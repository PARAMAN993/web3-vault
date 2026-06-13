// src/pages/LedgerLogin.jsx

import "./LedgerLogin.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

// ── Admin UIDs ────────────────────────────────────────────────────
const ADMIN_UIDS = [
  "k6092ZfyXdQ6h5wqzpBln5FCkdp2",
  "dJyRWesPqiMXLOznhcB9mA0sfu02",
];
// ─────────────────────────────────────────────────────────────────

function LedgerLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      return alert("Please fill all fields.");
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // refresh user state
      await user.reload();
      console.log("Logged in UID:", user.uid);

      // check verification
      if (!user.emailVerified) {
        navigate("/verify-email");
        return alert("Please verify your email first.");
      }

      // if admin → go to /admin, otherwise go to intended page or dashboard
      if (ADMIN_UIDS.includes(user.uid)) {
        navigate("/admin");
      } else {
        const from = location.state?.from || "/dashboard";
        navigate(from);
      }

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ledger-auth-page">
      <div className="auth-glow auth-glow-blue"></div>
      <div className="auth-glow auth-glow-pink"></div>

      <div className="auth-card fade-in">
        <div className="auth-icon">
          <ShieldCheck size={34} />
        </div>

        <h1 className="auth-title">
          <span className="safe">Safe</span>{" "}
          <span className="web3">Web3</span>{" "}
          <span className="vault">Vault</span>{" "}
          Login
        </h1>

        <p className="auth-subtitle">
          Secure access to your ledger portal
        </p>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="auth-options">
            <label className="remember-me">
              <input type="checkbox" />
              Remember me
            </label>
            <button type="button" className="forgot-password">
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="switch-auth">
          Don't have an account?{" "}
          <Link to="/ledger-register">Create account</Link>
        </p>

        <p className="secure-footer">🔒 Secure encrypted connection</p>
      </div>
    </div>
  );
}

export default LedgerLogin;
