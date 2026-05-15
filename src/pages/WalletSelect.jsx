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
import okx from "../assets/wallets/okx.png";
import phantom from "../assets/wallets/phantom.png";
import robinhood from "../assets/wallets/robinhood.png";
import arculus from "../assets/wallets/arculus.png";
import anchor from "../assets/wallets/anchor.png";
import bitbox from "../assets/wallets/bitbox02.png";
import tangem from "../assets/wallets/tangem.png";
import pillar from "../assets/wallets/pillar.png";
import gnosis from "../assets/wallets/gnosis.png";
import math from "../assets/wallets/math.png";
import onto from "../assets/wallets/onto.png";
import tokenp from "../assets/wallets/tokenp.png";
import walletc from "../assets/wallets/walletc.png";
import xamen from "../assets/wallets/xamen.png";
import maiar from "../assets/wallets/maiar.png";
import ledgerlive from "../assets/wallets/LedgerLive.png"; // ✅ FIXED
import eidoo from "../assets/wallets/eidoo.png";
import mykey from "../assets/wallets/mykey.png";
import coin98 from "../assets/wallets/coin98.png";
import coolwallet from "../assets/wallets/coolwallet.png";
import alice from "../assets/wallets/alice.png";
import gridplus from "../assets/wallets/gridplus.png";

function WalletSelect() {
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [openConnect, setOpenConnect] = useState(false);
  const [search, setSearch] = useState("");

  const popularWallets = [
    { name: "MetaMask", image: metamask },
    { name: "Trust Wallet", image: trust },
    { name: "SafePal", image: safepal },
    { name: "Coinbase", image: coin },
    { name: "Exodus", image: exodus },
    { name: "Ledger Live", image: ledgerlive }, // ✅ FIXED
    { name: "OKX", image: okx },
    { name: "Phantom", image: phantom },
    { name: "Robinhood", image: robinhood },
    { name: "Trezor", image: trezor },
    { name: "Arculus", image: arculus },
    { name: "Anchor", image: anchor },
    { name: "BitBox", image: bitbox },
    { name: "Tangem", image: tangem },
    { name: "Pillar", image: pillar },
    { name: "Gnosis", image: gnosis },
    { name: "MathWallet", image: math },
    { name: "ONTO", image: onto },
    { name: "TokenPocket", image: tokenp },
    { name: "Walletc", image: walletc },
    { name: "Xamen", image: xamen },
    { name: "Maiar", image: maiar },
    { name: "Eidoo", image: eidoo },
    { name: "MyKey", image: mykey },
    { name: "Coin98", image: coin98 },
    { name: "CoolWallet", image: coolwallet },
    { name: "Alice", image: alice },
    { name: "GridPlus", image: gridplus },
  ];

  const allWallets = [
    "Gate.io",
    "Zerion",
    "imToken",
    "BlockWallet",
    "XDEFI",
    "Frontier",
    "OneKey",
    "Zengo",
    "Ellipal",
    "Atomic Wallet",
  ];

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
        onConnect={() => setOpenConnect(true)}
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