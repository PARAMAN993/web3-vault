// src/pages/LedgerRegister.jsx

import "./LedgerRegister.css";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";

import { auth, db } from "../firebase/firebase";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

function LedgerRegister() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");   // ← New state

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage(""); // Clear error when user types
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      return setErrorMessage("Please fill all fields.");
    }

    if (password !== confirmPassword) {
      return setErrorMessage("Passwords do not match.");
    }

    if (password.length < 6) {
      return setErrorMessage("Password must be at least 6 characters.");
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await user.reload();

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName,
        email,
        createdAt: serverTimestamp(),
        portfolioBalance: 0,
        totalAssets: 0,
        connectedWallets: 0,
        securityScore: 80,
        assets: [],
        transactions: [],
        activity: [],
      });

      await sendEmailVerification(user);

      alert("Account created successfully! Please check your email to verify.");
      navigate("/verify-email");

    } catch (error) {
      console.error("REGISTER ERROR:", error);

      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("This email is already registered.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("Password is too weak. Use at least 6 characters.");
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ledger-auth-page">
      <div className="auth-card fade-in">
        <div className="auth-icon">
          <ShieldCheck size={34} />
        </div>

        <h1 className="auth-title">
          <span className="safe">Safe</span>{" "}
          <span className="web3">Web3</span>{" "}
          <span className="vaults">Vaults</span> Register
        </h1>

        <p className="auth-subtitle">Create your secure ledger account</p>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <div className="error-message" style={{ color: "red", margin: "10px 0", textAlign: "center" }}>
              {errorMessage}
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="switch-auth">
          Already have an account? <Link to="/ledger-login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default LedgerRegister;