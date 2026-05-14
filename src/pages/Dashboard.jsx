// src/pages/Dashboard.jsx

import "./Dashboard.css";
import { auth, db } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Wallet,
  Shield,
  Settings,
  Activity,
  Bell,
  LogOut,
  Briefcase,
  TrendingUp,
  Landmark,
  Bitcoin,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [crypto, setCrypto] = useState({});
  const [activities, setActivities] = useState([]);
  const [toast, setToast] = useState(null);

  // ✅ LIVE PRICES STATE
  const [prices, setPrices] = useState({});

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
        }
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  // ✅ FETCH LIVE CRYPTO PRICES
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

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  // ✅ REAL PORTFOLIO VALUE (USDT)
  const totalBalance = Object.entries(crypto || {}).reduce(
    (total, [coin, amount]) => {
      const price = prices[coin] || 0;
      return total + Number(amount) * price;
    },
    0
  );

  const stats = [
    {
      title: "Portfolio Balance",
      value: `$${totalBalance.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <Landmark size={22} />,
    },
    {
      title: "Total Assets",
      value: Object.keys(crypto || {}).length,
      icon: <Bitcoin size={22} />,
    },
    {
      title: "Connected Wallets",
      value: userData?.connectedWallets || 0,
      icon: <Wallet size={22} />,
    },
    {
      title: "Security Score",
      value: `${userData?.securityScore || 0}%`,
      icon: <Shield size={22} />,
    },
  ];

  // ✅ ENHANCED PORTFOLIO DATA
  const portfolio = Object.entries(crypto || {})
    .filter(([_, amount]) => Number(amount) > 0)
    .map(([coin, amount]) => ({
      name: coin.toUpperCase(),
      amount: Number(amount),
      value: (Number(amount) * (prices[coin] || 0)).toFixed(2),
    }));

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">

        <div>
          <div className="sidebar-logo">
            <h2>
              <span className="logo-safe">Safe</span>
              <span className="logo-web3">Web3</span>
              <span className="logo-vaults">Vaults</span>
            </h2>
          </div>

          <nav className="sidebar-nav">

            <div className="nav-item active">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </div>

            <div className="nav-item">
              <Briefcase size={20} />
              <span>Portfolio</span>
            </div>

            <div className="nav-item">
              <Wallet size={20} />
              <span>Wallets</span>
            </div>

            <div className="nav-item">
              <Activity size={20} />
              <span>Activity</span>
            </div>

            <div className="nav-item">
              <Shield size={20} />
              <span>Security</span>
            </div>

            <div className="nav-item">
              <Settings size={20} />
              <span>Settings</span>
            </div>

          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>

      </aside>

      {/* MAIN */}
      <main className="dashboard-main">

        {/* TOPBAR */}
        <header className="dashboard-topbar">

          <div>
            <h1 className="welcome-title">
              Welcome Back {userData?.fullName || ""}
            </h1>
            <p className="user-email">{userData?.email}</p>
          </div>

          <div className="topbar-right">
            <button className="notification-btn">
              <Bell size={20} />
            </button>

            <div className="profile-avatar">
              {userData?.fullName?.charAt(0).toUpperCase()}
            </div>
          </div>

        </header>

        {/* STATS */}
        <section className="stats-grid">
          {stats.map((stat, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-icon">{stat.icon}</div>
              <div>
                <h4>{stat.title}</h4>
                <h2>{stat.value}</h2>
              </div>
            </div>
          ))}
        </section>

        {/* PORTFOLIO */}
        <section className="dashboard-grid">

          <div className="portfolio-card">

            <div className="section-header">
              <TrendingUp size={22} />
              <h2>Portfolio Assets</h2>
            </div>

            <div className="portfolio-grid">
              {portfolio.map((coin, i) => (
                <div className="coin-card" key={i}>
                  <h3>{coin.name}</h3>

                  <p>
                    {coin.amount} {coin.name}
                  </p>

                  <p style={{ color: "#00d4ff", marginTop: "6px" }}>
                    ${coin.value}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* ACTIVITY */}
          <div className="activity-card">

            <div className="section-header">
              <Activity size={22} />
              <h2>Recent Activity</h2>
            </div>

            <div className="activity-list">
              {activities.map((item, i) => (
                <div className="activity-item" key={i}>
                  <div className="activity-dot"></div>
                  <p>{item}</p>
                </div>
              ))}
            </div>

          </div>

        </section>

      </main>

      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}

    </div>
  );
}

export default Dashboard;