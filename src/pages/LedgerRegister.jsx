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
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const {
      fullName,
      email,
      password,
      confirmPassword,
    } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      return alert("Please fill all fields.");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    if (password.length < 6) {
      return alert("Password must be at least 6 characters.");
    }

    try {
      setLoading(true);

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      await user.reload();

      if (!auth.currentUser) {
        throw new Error("Authentication not ready. Try again.");
      }

      // ✅ CLEAN USER STRUCTURE
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName,
        email,

        createdAt: serverTimestamp(),

        // ✅ ADMIN CONTROLLED
        portfolioBalance: 0,
        totalAssets: 0,
        connectedWallets: 0,
        securityScore: 80,

        // ✅ EMPTY SYSTEMS
        assets: [],
        transactions: [],
        activity: [],
      });

      await sendEmailVerification(user);

      alert("Account created! Please verify your email.");

      navigate("/verify-email");

    } catch (error) {
      console.error("REGISTER ERROR:", error);

      if (error.code === "auth/email-already-in-use") {
        alert("Email already in use.");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email address.");
      } else if (error.code === "auth/weak-password") {
        alert("Weak password.");
      } else {
        alert(error.message);
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
          <span className="vaults">Vaults</span>{" "}
          Register
        </h1>

        <p className="auth-subtitle">
          Create your secure ledger account
        </p>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="switch-auth">
          Already have an account?{" "}
          <Link to="/ledger-login">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}

export default LedgerRegister;