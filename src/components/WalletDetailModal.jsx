import "./WalletDetailModal.css";
import { FaTimes } from "react-icons/fa";

function WalletDetailModal({ wallet, isOpen, onClose, onConnect }) {
  if (!isOpen || !wallet) return null;

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div
        className="sheet-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* DRAG HANDLE */}
        <div className="sheet-handle" />

        {/* HEADER */}
        <div className="sheet-header">
          <h3>{wallet.name}</h3>
          <FaTimes onClick={onClose} />
        </div>

        {/* CONTENT */}
        <div className="sheet-body">
          {wallet.image && (
            <img
              src={wallet.image}
              alt={wallet.name}
              className="sheet-logo"
            />
          )}

          <p>
            Connect securely to {wallet.name}. This allows you to interact with
            Web3 features safely.
          </p>

          <button className="btn-primary full" onClick={onConnect}>
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}

export default WalletDetailModal;