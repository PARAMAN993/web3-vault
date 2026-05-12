import "./ConnectModal.css";
import { useNavigate } from "react-router-dom";

function ConnectModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleContinue = () => {
    onClose();
    navigate("/wallets");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="connect-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          className="close-btn"
          onClick={onClose}
        >
          ×
        </button>

        {/* HEADER */}
        <h2>Connect Wallet</h2>

        <p className="modal-subtitle">
          Gateway to Web3
        </p>

        {/* SECTION */}
        <h3 className="wallet-section-title">
          Backup Wallet
        </h3>

        <div className="wallet-line"></div>

        {/* CARD */}
        <div className="wallet-card">
          <div className="wallet-left">

            {/* BITCOIN LETTER ICON */}
            <div className="bitcoin-letter">
              ₿
            </div>

            <h3>
              Automatic / Manual backup
            </h3>
          </div>

          <button onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConnectModal;