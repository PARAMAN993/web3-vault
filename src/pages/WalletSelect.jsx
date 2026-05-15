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
import gnosis from "../assets/wallets/gnosis.png";
import math from "../assets/wallets/math.png";
import onto from "../assets/wallets/onto.png";
import tokenp from "../assets/wallets/tokenp.png";
import walletc from "../assets/wallets/walletc.png";
import xamen from "../assets/wallets/xamen.png";
import maiar from "../assets/wallets/maiar.png";
import ledgerlive from "../assets/wallets/ledgerlive.png";
import eidoo from "../assets/wallets/eidoo.png";
import mykey from "../assets/wallets/mykey.png";
import coin98 from "../assets/wallets/coin98.png";
import coolwallet from "../assets/wallets/coolwallet.png";
import alice from "../assets/wallets/alice.png";
import gridplus from "../assets/wallets/gridplus.png";
import cybavo from "../assets/wallets/cybavo.png";
import tokenary from "../assets/wallets/tokenary.png";
import wazirx from "../assets/wallets/wazirx.png";
import dcent from "../assets/wallets/dcent.png";
import zelcore from "../assets/wallets/zelcore.png";
import coinomi from "../assets/wallets/coinomi.jpg";
import alpha from "../assets/wallets/alpha.jpg";
import trustvault from "../assets/wallets/trustvault.png";
import loopring from "../assets/wallets/loopring.jpg";
import huobi from "../assets/wallets/huobi.jpg";
import walleth from "../assets/wallets/walleth.png";
import bitpay from "../assets/wallets/bitpay.png";
import torus from "../assets/wallets/torus.jpg";
import spatium from "../assets/wallets/spatium.jpg";
import infinito from "../assets/wallets/infinito.png";
import walletio from "../assets/wallets/walletio.png";
import infinity from "../assets/wallets/infinity.png";
import ownbit from "../assets/wallets/ownbit.png";
import easypocket from "../assets/wallets/easypocket.jpg";
import bridge from "../assets/wallets/bridge.png";
import sparkpoint from "../assets/wallets/sparkpoint.png";
import viawallet from "../assets/wallets/viawallet.png";
import bitkeep from "../assets/wallets/bitkeep.png";
import nash from "../assets/wallets/nash.jpg";
import vision from "../assets/wallets/vision.png";
import swift from "../assets/wallets/swift.png";
import peakdefi from "../assets/wallets/peakdefi.png";
import cosmostation from "../assets/wallets/cosmostation.png";
import graphprotocol from "../assets/wallets/graphprotocol.png";
import kardiachain from "../assets/wallets/kardiachain.png";
import keplr from "../assets/wallets/keplr.png";
import harmony from "../assets/wallets/harmony.png";
import iconex from "../assets/wallets/iconex.png";
import fetch from "../assets/wallets/fetch.jpg";
import xdc from "../assets/wallets/xdc.png";
import unstoppable from "../assets/wallets/unstoppable.png";
import meetone from "../assets/wallets/meetone.jpg";
import dok from "../assets/wallets/dok.png";
import at from "../assets/wallets/at.png";
import morix from "../assets/wallets/morix.png";
import midas from "../assets/wallets/midas.png";
import ellipal from "../assets/wallets/ellipal.png";
import keyring from "../assets/wallets/keyring.png";
import blockchain from "../assets/wallets/blockchain.png";
import binancesmartchain from "../assets/wallets/binancesmartchain.png";
import aktionariat from "../assets/wallets/aktionariat.png";



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
    { name: "SafePal", image: safepal },
    { name: "Coinbase", image: coin },
    { name: "Exodus", image: exodus },
    { name: "Ledger Nano X", image: ledger },
    { name: "OKX", image: okx },
    { name: "Phantom", image: phantom },
    { name: "Robinhood", image: robinhood },
    { name: "Trezor", image: trezor },
    { name: "Arculus", image: arculus},
    { name: "Anchor", image: anchor},
    { name: "BitBox", image: bitbox},
    { name: "Tangem", image: tangem},
    { name: "Pillar", image: pillar},
    { name: "Gnosis Safe Multisig", image: gnosis},
    { name: "MathWallet", image: math},
    { name: "ONTO", image: onto},
    { name: "TokenPocket", image: tokenp},
    { name: "Walletc", image: walletc},
    { name: "Xamen", image: xamen},
    { name: "Maiar", image: maiar},
    { name: "Ledger live", image: ledgerlive},
    { name: "Eidoo", image: eidoo},
    { name: "Mykey", image: mykey},
    { name: "Coin98", image: coin98},
    { name: "coolWallet s", image: coolwallet},
    { name: "Alice", image: alice},
    { name: "Gridplus", image: gridplus},
    { name: "CYBAVO Wallet", image: cybavo},
    { name: "Tokenary", image: tokenary},
    { name: "wazirx", image: wazirx},
    { name: "D'CENT Wallet", image: dcent},
    { name: "Zelcore", image: zelcore},
    { name: "Coinomi", image: coinomi},
    { name: "Alpha", image: alpha},
    { name: "Trustvault", image: trustvault},
    { name: "Loopring Wallet", image: loopring},
    { name: "Huobi", image: huobi},
    { name: "Walleth", image: walleth},
    { name: "Bitpay", image: bitpay},
    { name: "Torus", image: torus},
    { name: "Spatium", image: spatium},
    { name: "Infinito", image: infinito},
    { name: "Wallet.io", image: walletio},
    { name: "Infinity Wallet", image: infinity},
    { name: "Ownbit", image: ownbit},
    { name: "EasyPocket", image: easypocket},
    { name: "Bridge Wallet", image: bridge},
    { name: "SparkPoint", image: sparkpoint},
    { name: "ViaWallet", image: viawallet},
    { name: "BitKeep", image: bitkeep},
    { name: "Vision", image: vision},
    { name: "Nash", image: nash},
    { name: "SWFT Wallet", image: swift},
    { name: "PEAKDEFI Wallet", image: peakdefi},
    { name: "Cosmostation", image: cosmostation},
    { name: "Graph Protocol", image: graphprotocol},
    { name: "KardiaChain", image: kardiachain},
    { name: "Keplr", image: keplr},
    { name: "Harmony", image: harmony},
    { name: "ICONex", image: iconex},
    { name: "Fetch", image: fetch},
    { name: "Xdc Wallet", image: xdc},
    { name: "Unstoppable Wallet", image: unstoppable},
    { name: "MEET.ONE", image: meetone},
    { name: "Dok Wallet", image: dok},
    { name: "AT.Wallet", image: at},
    { name: "Morix Wallet", image: morix},
    { name: "Midas Wallet", image: midas},
    { name: "Ellipal", image: ellipal},
    { name: "Keyring Pro", image: keyring},
    { name: "Blockchain", image: blockchain},
    { name: "Binance Smart Chain", image: binancesmartchain},
    { name: "Ationariat", image: aktionariat},
  ];

  /* =========================
     ALL WALLETS
  ========================= */
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