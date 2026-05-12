// src/pages/AccountSuccess.jsx

import "./AccountSuccess.css";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function AccountSuccess() {
  const navigate = useNavigate();

  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/ledger-login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <h1>
          Welcome,
          <span>{user?.email}</span>
        </h1>

        <p>
          Your Access Ledger account
          is active and verified.
        </p>

        <button
          className="dashboard-btn"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default AccountSuccess;