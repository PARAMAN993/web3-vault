// src/pages/Dashboard.jsx
import "./Dashboard.css";
import { auth, db } from "../firebase/firebase";
import { signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import {
  LayoutDashboard, Wallet, Shield, Settings,
  Activity, Bell, LogOut, Briefcase, TrendingUp,
  Landmark, Bitcoin, Menu, X, Save, User, Mail,
  ChevronRight,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [crypto, setCrypto] = useState({});
  const [activities, setActivities] = useState([]);
  const [toast, setToast] = useState(null);
  const [prices, setPrices] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Settings form state
  const [settingsName, setSettingsName] = useState("");
  const [settingsEmail, setSettingsEmail] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);

  const bellRef = useRef(null);

  // Refs for scroll targets
  const portfolioRef = useRef(null);
  const walletsRef = useRef(null);
  const activityRef = useRef(null);
  const securityRef = useRef(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) return;
      const docRef = doc(db, "users", currentUser.uid);
      const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setCrypto(data?.crypto || {});
          setActivities(data?.activity || []);
          setSettingsName(data?.fullName || "");
          setSettingsEmail(data?.email || "");
        }
      });
      return () => unsubscribeSnapshot();
    });
    return () => unsubscribeAuth();
  }, []);

  // Close bell when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple&vs_currencies=usd"
        );
        const data = await res.json();
        setPrices({
          BTC: data.bitcoin?.usd || 0,
          ETH: data.ethereum?.usd || 0,
          SOL: data.solana?.usd || 0,
          BNB: data.binancecoin?.usd || 0,
          XRP: data.ripple?.usd || 0,
        });
      } catch (err) {
        console.log("Price fetch error", err);
      }
    };
    fetchPrices();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/ledger-login");
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const scrollTo = (ref) => {
    setMenuOpen(false);
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const openSettings = () => {
    setMenuOpen(false);
    setSettingsOpen(true);
  };

  const saveSettings = async () => {
    if (!settingsName.trim()) {
      showToast("Name cannot be empty", "error");
      return;
    }
    setSettingsSaving(true);
    try {
      const currentUser = auth.currentUser;
      // Update Firestore
      await updateDoc(doc(db, "users", currentUser.uid), {
        fullName: settingsName.trim(),
      });
      // Update Firebase Auth display name
      await updateProfile(currentUser, { displayName: settingsName.trim() });
      showToast("Settings saved");
      setSettingsOpen(false);
    } catch (err) {
      showToast("Failed to save: " + err.message, "error");
    } finally {
      setSettingsSaving(false);
    }
  };

  const totalBalance = Object.entries(crypto || {}).reduce(
    (total, [coin, amount]) => total + Number(amount) * (prices[coin] || 0), 0
  );

  const portfolio = Object.entries(crypto || {})
    .filter(([_, amount]) => Number(amount) > 0)
    .map(([coin, amount]) => ({
      name: coin.toUpperCase(),
      amount: Number(amount),
      value: (Number(amount) * (prices[coin] || 0)).toFixed(2),
    }));

  const navLinks = [
    { icon: <LayoutDashboard size={19} />, label: "Dashboard", action: () => { setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); } },
    { icon: <Briefcase size={19} />, label: "Portfolio", action: () => scrollTo(portfolioRef) },
    { icon: <Wallet size={19} />, label: "Wallets", action: () => scrollTo(walletsRef) },
    { icon: <Activity size={19} />, label: "Activity", action: () => scrollTo(activityRef) },
    { icon: <Shield size={19} />, label: "Security", action: () => scrollTo(securityRef) },
    { icon: <Settings size={19} />, label: "Settings", action: openSettings },
  ];

  const securityItems = [
    { icon: <Shield size={22} />, title: "Two-Factor Auth", desc: "Add an extra layer of protection to your account with 2FA verification." },
    { icon: <Wallet size={22} />, title: "Wallet Encryption", desc: "Your wallets are encrypted end-to-end using military-grade AES-256 encryption." },
    { icon: <Activity size={22} />, title: "Login Activity", desc: "Monitor all login attempts and active sessions on your account in real time." },
  ];

  return (
    <div className="db-root">

      {/* ── HEADER ── */}
      <header className="db-header">
        <div className="db-header-left">
          <div className="db-logo">
            <span className="logo-safe">Safe</span>
            <span className="logo-web3">Web3</span>
            <span className="logo-vault">Vault</span>
          </div>
          <div className="db-balance-pill">
            <span className="balance-label">Total Balance</span>
            <span className="balance-value">
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="db-header-right">
          {/* Bell */}
          <div className="db-bell-wrap" ref={bellRef}>
            <button className="db-icon-btn" onClick={() => setBellOpen(!bellOpen)}>
              <Bell size={19} />
              {activities.length > 0 && <span className="bell-dot" />}
            </button>

            {bellOpen && (
              <div className="db-bell-dropdown">
                <div className="bell-header">
                  <span>Recent Activity</span>
                  <span className="bell-count">{activities.length}</span>
                </div>
                <div className="bell-list">
                  {activities.length === 0 && (
                    <p className="bell-empty">No recent activity.</p>
                  )}
                  {activities.slice(0, 6).map((item, i) => (
                    <div className="bell-item" key={i}>
                      <div className="bell-dot-sm" />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="db-avatar">
            {userData?.fullName?.charAt(0).toUpperCase()}
          </div>
          <button className="db-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ── SLIDE-IN MENU ── */}
      <div className={`db-menu ${menuOpen ? "open" : ""}`}>
        <div className="db-menu-user">
          <div className="db-avatar db-avatar-lg">
            {userData?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="db-menu-name">{userData?.fullName || ""}</p>
            <p className="db-menu-email">{userData?.email}</p>
          </div>
        </div>
        <nav className="db-menu-nav">
          {navLinks.map((link, i) => (
            <div key={i} className={`db-menu-item ${i === 0 ? "active" : ""}`} onClick={link.action}>
              {link.icon}
              <span>{link.label}</span>
              <ChevronRight size={15} className="menu-chevron" />
            </div>
          ))}
        </nav>
        <button className="db-menu-logout" onClick={handleLogout}>
          <LogOut size={17} /> Logout
        </button>
      </div>

      {(menuOpen || settingsOpen) && (
        <div className="db-overlay" onClick={() => { setMenuOpen(false); setSettingsOpen(false); }} />
      )}

      {/* ── SETTINGS PANEL ── */}
      <div className={`db-settings-panel ${settingsOpen ? "open" : ""}`}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="settings-close" onClick={() => setSettingsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="settings-body">
          <p className="settings-subtitle">Update your profile information below.</p>

          <div className="settings-field">
            <label><User size={14} /> Display Name</label>
            <input
              type="text"
              value={settingsName}
              onChange={(e) => setSettingsName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div className="settings-field">
            <label><Mail size={14} /> Email Address</label>
            <input
              type="email"
              value={settingsEmail}
              disabled
              placeholder="Email"
              className="input-disabled"
            />
            <p className="field-hint">Email cannot be changed here. Contact support.</p>
          </div>

          <div className="settings-divider" />

          <div className="settings-info-row">
            <div className="settings-info-item">
              <span className="info-label">Security Score</span>
              <span className="info-val">{userData?.securityScore || 0}%</span>
            </div>
            <div className="settings-info-item">
              <span className="info-label">Connected Wallets</span>
              <span className="info-val">{userData?.connectedWallets || 0}</span>
            </div>
            <div className="settings-info-item">
              <span className="info-label">Total Assets</span>
              <span className="info-val">{Object.keys(crypto || {}).length}</span>
            </div>
          </div>

          <button
            className="settings-save-btn"
            onClick={saveSettings}
            disabled={settingsSaving}
          >
            <Save size={16} />
            {settingsSaving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <main className="db-main">

        {/* Welcome */}
        <div className="db-welcome">
          <h1 className="db-welcome-title">Welcome back, {userData?.fullName?.split(" ")[0] || ""}</h1>
          <p className="db-welcome-sub">{userData?.email}</p>
        </div>

        {/* STATS */}
        <div className="db-stat-row">
          {[
            { icon: <Landmark size={18} />, label: "Portfolio Balance", val: `$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
            { icon: <Bitcoin size={18} />, label: "Total Assets", val: Object.keys(crypto || {}).length },
            { icon: <Wallet size={18} />, label: "Connected Wallets", val: userData?.connectedWallets || 0 },
            { icon: <Shield size={18} />, label: "Security Score", val: `${userData?.securityScore || 0}%` },
          ].map((s, i) => (
            <div className="db-stat-chip" key={i}>
              <div className="db-stat-icon">{s.icon}</div>
              <div>
                <p className="db-stat-label">{s.label}</p>
                <p className="db-stat-val">{s.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* PORTFOLIO */}
        <div className="db-section-anchor" ref={portfolioRef} />
        <div className="db-card" id="portfolio">
          <div className="db-card-header">
            <TrendingUp size={20} />
            <h2>Portfolio Assets</h2>
          </div>
          <div className="db-coin-grid">
            {portfolio.length === 0 && <p className="db-empty">No assets yet.</p>}
            {portfolio.map((coin, i) => (
              <div className="db-coin-card" key={i}>
                <div className="db-coin-badge">{coin.name.charAt(0)}</div>
                <div className="db-coin-info">
                  <p className="db-coin-name">{coin.name}</p>
                  <p className="db-coin-amount">{coin.amount} {coin.name}</p>
                </div>
                <p className="db-coin-value">${coin.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* WALLETS + ACTIVITY side by side */}
        <div className="db-two-col">

          <div className="db-card" id="wallets">
            <div className="db-section-anchor" ref={walletsRef} />
            <div className="db-card-header">
              <Wallet size={20} />
              <h2>Connected Wallets</h2>
            </div>
            <div className="db-wallets-list">
              {userData?.connectedWallets > 0 ? (
                Array.from({ length: userData.connectedWallets }).map((_, i) => (
                  <div className="db-wallet-row" key={i}>
                    <div className="db-wallet-icon"><Wallet size={16} /></div>
                    <div>
                      <p className="db-wallet-name">Wallet {i + 1}</p>
                      <p className="db-wallet-addr">••••••••••••••••</p>
                    </div>
                    <span className="db-wallet-badge">Connected</span>
                  </div>
                ))
              ) : (
                <p className="db-empty">No wallets connected.</p>
              )}
            </div>
          </div>

          <div className="db-card" id="activity">
            <div className="db-section-anchor" ref={activityRef} />
            <div className="db-card-header">
              <Activity size={20} />
              <h2>Recent Activity</h2>
            </div>
            <div className="db-activity-list">
              {activities.length === 0 && <p className="db-empty">No recent activity.</p>}
              {activities.map((item, i) => (
                <div className="db-activity-item" key={i}>
                  <div className="db-activity-dot" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* SECURITY */}
        <div className="db-section-anchor" ref={securityRef} />
        <div className="db-card" id="security">
          <div className="db-card-header">
            <Shield size={20} />
            <h2>Security</h2>
          </div>
          <div className="db-security-grid">
            {securityItems.map((item, i) => (
              <div className="db-security-card" key={i}>
                <div className="db-security-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      {toast && <div className={`db-toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

export default Dashboard;
