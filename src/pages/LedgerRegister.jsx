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

import { doc, setDoc } from "firebase/firestore";

function LedgerRegister() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleRegister =
    async (e) => {
      e.preventDefault();

      const {
        fullName,
        email,
        password,
        confirmPassword,
      } = formData;

      if (
        !fullName ||
        !email ||
        !password ||
        !confirmPassword
      ) {
        return alert(
          "Please fill all fields."
        );
      }

      if (
        password !==
        confirmPassword
      ) {
        return alert(
          "Passwords do not match."
        );
      }

      if (password.length < 6) {
        return alert(
          "Password must be at least 6 characters."
        );
      }

      try {
        setLoading(true);

        // Create user
        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

        const user =
          userCredential.user;

        // Save user data + dashboard data
        await setDoc(
          doc(
            db,
            "users",
            user.uid
          ),
          {
            uid: user.uid,

            fullName,
            email,

            createdAt:
              new Date(),

            portfolioBalance:
              248492.8,

            connectedWallets:
              4,

            securityScore:
              98,

            crypto: {
              btc: 0.8472,
              eth: 12.53,
              usdt: 8400,
              bnb: 23.4,
              xrp: 4522,
              sol: 75.3,
              ada: 12000,
              doge: 84000,
              trx: 23500,
              matic: 3920,
            },

            activity: [
              "Wallet linked successfully",
              "Deposit of 2.3 ETH confirmed",
              "Security settings updated",
              "New login detected",
            ],
          }
        );

        // Send verification email
        await sendEmailVerification(
          user
        );

        // Go to verification page
        navigate(
          "/verify-email"
        );

      } catch (error) {
        alert(error.message);

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
          <span className="safe">
            Safe
          </span>{" "}
          <span className="web3">
            Web3
          </span>{" "}
          <span className="vaults">
            Vaults
          </span>{" "}
          Register
        </h1>

        <p className="auth-subtitle">
          Create your secure
          ledger account
        </p>

        <form
          className="auth-form"
          onSubmit={
            handleRegister
          }
        >
          <div className="input-group">
            <label>
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={
                formData.fullName
              }
              onChange={
                handleChange
              }
            />
          </div>

          <div className="input-group">
            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
            />
          </div>

          <div className="input-group">
            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
            />
          </div>

          <div className="input-group">
            <label>
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={
                formData.confirmPassword
              }
              onChange={
                handleChange
              }
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <p className="switch-auth">
          Already have an
          account?{" "}
          <Link to="/ledger-login">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}

export default LedgerRegister;