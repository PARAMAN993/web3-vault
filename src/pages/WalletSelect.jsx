import "./WalletSelect.css";
import { useState } from "react";
import WalletDetailModal from "../components/WalletDetailModal";
import ConnectFormModal from "../components/ConnectFormModal";

/* WALLET IMAGES */
import metamask from "../assets/wallets/metamask.png";
import trust from "../assets/wallets/trust.png";
import safepal from "../assets/wallets/safepal.png";
import coin from "../assets/wallets/coin.png";
import exodus from "../assets/wallets/exodus.png";
import trezor from "../assets/wallets/trezor.png";
import ledger from "../assets/wallets/ledger.png";
import okx from "../assets/wallets/okx.png";
import phantom from "../assets/wallets/phantom.png";
import robinhood from "../assets/wallets/robinhood.png";
import arculus from "../assets/wallets/arculus.png";
import anchor from "../assets/wallets/anchor.png";
import bitbox from "../assets/wallets/bitbox02.png";
import tangem from "../assets/wallets/tangem.png";
import pillar from "../assets/wallets/pillar.png";


function WalletSelect() {
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [openConnect, setOpenConnect] = useState(false);
  const [search, setSearch] = useState("");

  /* =========================
     POPULAR WALLETS
  ========================= */
  const popularWallets = [
    { name: "MetaMask", image: metamask },
    { name: "Trust Wallet", image: trust },
    { name: "Safepal", image: safepal },
    { name: "Coinbase", image: coin },
    { name: "Exodus", image: exodus },
    { name: "Ledger", image: ledger },
    { name: "OKX", image: okx },
    { name: "Phantom", image: phantom },
    { name: "Robinhood", image: robinhood },
    { name: "Trezor", image: trezor },
    { name: "Arculus", image: arculus},
    { name: "Anchor", image: anchor},
    { name: "Bitbox", image: bitbox},
    { name: "Tangem", image: tangem},
    { name: "Pillar", image: pillar},
  ];

  /* =========================
     ALL WALLETS
  ========================= */
  const allWallets = [
    "Gate.io",
    "Token Pocket",
    "BitPay",
    "Zerion",
    "imToken",
    "AlphaWallet",
    "Coin98",
    "Infinity Wallet",
    "Huobi Wallet",
    "Wallet Connect",
    "BitKeep",
    "BlockWallet",
    "XDEFI",
    "Math Wallet",
    "Frontier",
    "Loopring",
    "Maiar",
    "Ledger Live",
    "Bitget Wallet",
    "OneKey",
    "Zengo",
    "Ellipal",
    "Eidoo",
    "Trust Vault",
    "CoolWallet",
    "Atomic Wallet",
    "Coinomi",
  ];

  /* =========================
     SEARCH FILTER (WORKING)
  ========================= */
  const filteredPopular = popularWallets.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAll = allWallets.filter((w) =>
    w.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="wallet-page">

      {/* NAVBAR */}
      <div className="wallet-navbar">
        <span className="logo">SAFE WEB3 VAULTS</span>
        <button className="wallet-nav-btn">Secure Wallet</button>
      </div>

      {/* HEADER */}
      <div className="wallet-header">
        <h2 className="wallet-title">Select Your Wallet</h2>

        <p className="wallet-subtitle">
          Choose from popular wallets or browse all supported options
        </p>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search wallet..."
          className="wallet-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* POPULAR */}
      <h3 className="section-title">Popular Wallets</h3>

      <div className="wallet-grid">
        {filteredPopular.map((wallet, index) => (
          <div
            key={index}
            className="wallet-card"
            onClick={() => setSelectedWallet(wallet)}
          >
            <img src={wallet.image} alt={wallet.name} />
            <span>{wallet.name}</span>
          </div>
        ))}
      </div>

      {/* ALL */}
      <h3 className="section-title">All Wallets</h3>

      <div className="wallet-list">
        {filteredAll.map((name, index) => (
          <div
            key={index}
            className="wallet-row"
            onClick={() => setSelectedWallet({ name })}
          >
            <span>{name}</span>
            <span className="wallet-arrow">→</span>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <WalletDetailModal
        wallet={selectedWallet}
        isOpen={!!selectedWallet}
        onClose={() => setSelectedWallet(null)}
        onConnect={() => {
  setOpenConnect(true);
}}
      />

      <ConnectFormModal
  isOpen={openConnect}
  wallet={selectedWallet}
  onClose={() => {
    setOpenConnect(false);
    setSelectedWallet(null);
  }}
/>
    </div>
  );
}

export default WalletSelect;