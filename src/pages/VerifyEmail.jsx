import "./VerifyEmail.css";

import { useEffect } from "react";
import { Mail, LogOut, RefreshCw } from "lucide-react";
import { auth } from "../firebase/firebase";

import {
  sendEmailVerification,
  signOut,
} from "firebase/auth";

import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const navigate = useNavigate();

  useEffect(() => {
  const checkVerification =
    setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();

        if (
          auth.currentUser
            .emailVerified
        ) {
          navigate("/dashboard");
        }
      }
    }, 3000);

  return () =>
    clearInterval(
      checkVerification
    );
}, [navigate]);

  const resendEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(
          auth.currentUser
        );

        alert(
          "Verification email sent again."
        );
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/ledger-login");
  };

  return (
    <div className="verify-page">
      <div className="verify-card fade-in">

        <div className="verify-icon">
          <Mail size={38} />
        </div>

        <h1 className="verify-brand">
          <span className="safe">Safe</span>{" "}
          <span className="web3">Web3</span>{" "}
          <span className="vault">
            Vault
          </span>
        </h1>

        <h2>Verify Your Email</h2>

        <p>
          Thanks for signing up.
          Before getting started,
          please verify your email
          address using the link sent
          to your inbox.
        </p>

        <button
          className="verify-btn primary"
          onClick={resendEmail}
        >
          <RefreshCw size={18} />
          Resend Verification Email
        </button>

        <button
          className="verify-btn secondary"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Log Out
        </button>

      </div>
    </div>
  );
}

export default VerifyEmail;