// src/components/DepositModal.jsx
import "./DepositModal.css";
import { useState } from "react";
import { X, ArrowDownLeft, Copy, CheckCheck } from "lucide-react";

const DEPOSIT_COINS = [
  {
    name: "USDT",
    network: "Ethereum (ERC-20)",
    address: "0xdc6759Aa75E8929aB3e8bFba7B8FE558b3EE82ce",
    memo: null,
    color: "#26a17b",
  },
  {
    name: "ETH",
    network: "Ethereum",
    address: "0xdc6759Aa75E8929aB3e8bFba7B8FE558b3EE82ce",
    memo: null,
    color: "#627eea",
  },
  {
    name: "BTC",
    network: "Bitcoin",
    address: "bc1qt9r56td2s0f5cerhj2j70yeu48g0enscc5ysjl",
    memo: null,
    color: "#f7931a",
  },
  {
    name: "SOL",
    network: "Solana",
    address: "E5bMP28SRgv3enYvSWUtwHhBetd9wKWFHH1SP6d4ZsDM",
    memo: null,
    color: "#9945ff",
  },
  {
    name: "BNB",
    network: "BNB Smart Chain (BEP-20)",
    address: "0xdc6759Aa75E8929aB3e8bFba7B8FE558b3EE82ce",
    memo: null,
    color: "#f3ba2f",
  },
  {
    name: "XRP",
    network: "XRP Ledger",
    address: "rw4g24hDS5xLcaJ99ueQsvBn8Hwrfc45jh",
    memo: null,
    color: "#00aae4",
  },
  {
    name: "XLM",
    network: "Stellar",
    address: "GC4Y5K7P7HHMTXU2EM7S2VF2OES53WAFK2RW5Z4GGCY2XAKYU7Y7XMJR",
    memo: null,
    color: "#7c5cfc",
  },
  {
    name: "ADA",
    network: "Cardano",
    address: "addr1qx6kasv2lkttyve4h2x88r85e3c07mnupga0ympwe2dd8qkfp7vqfgqf99apejfahq7vptztztnr3dh6l28ljfq2ls9qurpzmy",
    memo: null,
    color: "#0033ad",
  },
  {
    name: "DOGE",
    network: "Dogecoin",
    address: "DMN1hARbbk7nzUVthH1863tj4N1Ngww5Br",
    memo: null,
    color: "#c2a633",
  },
];

function DepositModal({ isOpen, onClose }) {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setSelectedCoin(null);
    setCopied(false);
    onClose();
  };

  return (
    <div className="dmodal-overlay" onClick={handleClose}>
      <div className="dmodal" onClick={(e) => e.stopPropagation()}>

        <div className="dmodal-header">
          <div className="dmodal-title-row">
            <div className="dmodal-icon"><ArrowDownLeft size={20} /></div>
            <h2>Deposit Crypto</h2>
          </div>
          <button className="dmodal-close" onClick={handleClose}><X size={20} /></button>
        </div>

        {!selectedCoin ? (
          <div className="dmodal-body">
            <p className="dmodal-subtitle">Select the cryptocurrency you want to deposit.</p>
            <div className="dmodal-coin-list">
              {DEPOSIT_COINS.map((coin) => (
                <button
                  key={coin.name}
                  className="dmodal-coin-row"
                  onClick={() => setSelectedCoin(coin)}
                  style={{ "--coin-color": coin.color }}
                >
                  <div className="dmodal-coin-badge">{coin.name.charAt(0)}</div>
                  <div className="dmodal-coin-info">
                    <span className="dmodal-coin-name">{coin.name}</span>
                    <span className="dmodal-coin-network">{coin.network}</span>
                  </div>
                  <span className="dmodal-coin-arrow">→</span>
                </button>
              ))}
            </div>

            <div className="dmodal-notice">
              Only send the matching cryptocurrency to each address. Sending the wrong coin may result in permanent loss.
            </div>
          </div>
        ) : (
          <div className="dmodal-body">
            <button className="dmodal-back" onClick={() => { setSelectedCoin(null); setCopied(false); }}>
              ← Back to coin list
            </button>

            <div className="dmodal-selected-header" style={{ "--coin-color": selectedCoin.color }}>
              <div className="dmodal-selected-badge">{selectedCoin.name.charAt(0)}</div>
              <div>
                <p className="dmodal-selected-name">{selectedCoin.name}</p>
                <p className="dmodal-selected-network">{selectedCoin.network}</p>
              </div>
            </div>

            {/* QR placeholder */}
            <div className="dmodal-qr-box">
              <div className="dmodal-qr-inner">
                <div className="qr-grid">
                  {Array.from({ length: 81 }).map((_, i) => (
                    <div
                      key={i}
                      className="qr-cell"
                      style={{ background: Math.random() > 0.5 ? "#e2e8f0" : "transparent" }}
                    />
                  ))}
                </div>
              </div>
              <p className="qr-label">Scan QR code or copy address below</p>
            </div>

            {/* Address */}
            <div className="dmodal-field">
              <label>Deposit Address</label>
              <div className="dmodal-address-box">
                <span className="dmodal-address-text">{selectedCoin.address}</span>
                <button
                  className={`dmodal-copy-btn ${copied ? "copied" : ""}`}
                  onClick={() => handleCopy(selectedCoin.address)}
                >
                  {copied ? <><CheckCheck size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>
            </div>

            {/* Network */}
            <div className="dmodal-info-row">
              <span>Network</span>
              <span>{selectedCoin.network}</span>
            </div>

            {selectedCoin.memo && (
              <div className="dmodal-field">
                <label>Memo / Destination Tag</label>
                <div className="dmodal-address-box">
                  <span className="dmodal-address-text">{selectedCoin.memo}</span>
                  <button className="dmodal-copy-btn" onClick={() => handleCopy(selectedCoin.memo)}>
                    <Copy size={14} /> Copy
                  </button>
                </div>
              </div>
            )}

            <div className="dmodal-warning">
              ⚠ Only send <strong>{selectedCoin.name}</strong> on the <strong>{selectedCoin.network}</strong> network to this address. Wrong network deposits cannot be recovered.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default DepositModal;
