// src/components/WithdrawModal.jsx
import "./WithdrawModal.css";
import { useState } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { X, ArrowUpRight, CheckCircle, AlertCircle } from "lucide-react";

function WithdrawModal({ isOpen, onClose, portfolio }) {
  const [step, setStep] = useState("form"); // "form" | "success"
  const [selectedCoin, setSelectedCoin] = useState("");
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const selectedAsset = portfolio.find((c) => c.name === selectedCoin);
  const maxAmount = selectedAsset ? selectedAsset.amount : 0;

  const validate = () => {
    if (!selectedCoin) return "Please select an asset.";
    if (!amount || isNaN(amount) || Number(amount) <= 0) return "Please enter a valid amount.";
    if (Number(amount) > maxAmount) return `Insufficient balance. Max: ${maxAmount} ${selectedCoin}`;
    if (!walletAddress.trim()) return "Please enter a wallet address.";
    if (walletAddress.trim().length < 10) return "Please enter a valid wallet address.";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    try {
      await addDoc(collection(db, "withdrawalRequests"), {
        userId: auth.currentUser?.uid || null,
        coin: selectedCoin,
        amount: Number(amount),
        walletAddress: walletAddress.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setStep("success");
    } catch (e) {
      setError("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("form");
    setSelectedCoin("");
    setAmount("");
    setWalletAddress("");
    setError("");
    onClose();
  };

  return (
    <div className="wmodal-overlay" onClick={handleClose}>
      <div className="wmodal" onClick={(e) => e.stopPropagation()}>

        {step === "form" && (
          <>
            <div className="wmodal-header">
              <div className="wmodal-title-row">
                <div className="wmodal-icon withdraw-icon"><ArrowUpRight size={20} /></div>
                <h2>Withdraw Funds</h2>
              </div>
              <button className="wmodal-close" onClick={handleClose}><X size={20} /></button>
            </div>

            <div className="wmodal-body">
              {/* Asset selector */}
              <div className="wmodal-field">
                <label>Select Asset</label>
                <select
                  value={selectedCoin}
                  onChange={(e) => { setSelectedCoin(e.target.value); setAmount(""); setError(""); }}
                >
                  <option value="">-- Choose asset --</option>
                  {portfolio.map((coin) => (
                    <option key={coin.name} value={coin.name}>
                      {coin.name} — Balance: {coin.amount}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div className="wmodal-field">
                <label>
                  Amount
                  {selectedAsset && (
                    <span className="field-max" onClick={() => setAmount(String(maxAmount))}>
                      Max: {maxAmount} {selectedCoin}
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  min="0"
                  step="any"
                  onChange={(e) => { setAmount(e.target.value); setError(""); }}
                />
                {selectedAsset && amount && (
                  <p className="field-usd-hint">≈ ${(Number(amount) * (selectedAsset.usdValue / selectedAsset.amount || 0)).toFixed(2)} USD</p>
                )}
              </div>

              {/* Wallet address */}
              <div className="wmodal-field">
                <label>Destination Wallet Address</label>
                <input
                  type="text"
                  placeholder="Paste wallet address here"
                  value={walletAddress}
                  onChange={(e) => { setWalletAddress(e.target.value); setError(""); }}
                />
              </div>

              {error && (
                <div className="wmodal-error">
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              <div className="wmodal-notice">
                <AlertCircle size={14} />
                <p>Withdrawal requests are reviewed within 24–48 hours. Ensure the address is correct — transactions cannot be reversed.</p>
              </div>

              <button
                className="wmodal-submit-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting…" : "Submit Withdrawal Request"}
              </button>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="wmodal-success">
            <div className="success-icon-wrap">
              <CheckCircle size={48} />
            </div>
            <h2>Request Submitted!</h2>
            <p>Your withdrawal request for <strong>{amount} {selectedCoin}</strong> has been submitted successfully.</p>
            <p className="success-time">Processing takes <strong>24–48 hours</strong>. You will be notified once your transaction is approved.</p>
            <div className="success-detail-row">
              <span>Asset</span><span>{selectedCoin}</span>
            </div>
            <div className="success-detail-row">
              <span>Amount</span><span>{amount} {selectedCoin}</span>
            </div>
            <div className="success-detail-row">
              <span>Address</span>
              <span className="success-addr">{walletAddress.slice(0, 12)}…{walletAddress.slice(-6)}</span>
            </div>
            <div className="success-detail-row">
              <span>Status</span><span className="success-pending">Pending Review</span>
            </div>
            <button className="wmodal-done-btn" onClick={handleClose}>Done</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default WithdrawModal;