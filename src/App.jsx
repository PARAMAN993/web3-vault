import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AccountSuccess from "./pages/AccountSuccess";
import VerifyEmail from "./pages/VerifyEmail";
import LedgerLogin from "./pages/LedgerLogin";
import LedgerRegister from "./pages/LedgerRegister";
import "./BackgroundEffects.css";
import "./components/Hero.css";
import WalletRecoverySection from "./components/WalletRecoverySection";
import SecureSection from "./components/SecureSection";
import Newsletter from "./components/Newsletter";
import TrustedBy from "./components/TrustedBy";
import Navbar from "./components/Navbar";
import HowToGetStarted from "./components/HowToGetStarted";
import FAQ from "./components/FAQ";

import WalletSelect from "./pages/WalletSelect";

import ConnectModal from "./components/ConnectModal";

import { useEffect, useState, useRef } from "react";
import { useCountUp } from "react-countup";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import web3Image from "./assets/web3-visual.png";

import AOS from "aos";
import "aos/dist/aos.css";

/* =========================
   STAT COMPONENT
========================= */
function Stat({ end, suffix = "", prefix = "", decimals = 0 }) {
  const countUpRef = useRef(null);

  useCountUp({
    ref: countUpRef,
    end,
    duration: 2,
    decimals,
    enableScrollSpy: true,
    scrollSpyDelay: 200,
  });

  return (
    <h3>
      {prefix}
      <span ref={countUpRef}></span>
      {suffix}
    </h3>
  );
}

/* =========================
   HOME PAGE
========================= */
function HomePage() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    const x = (window.innerWidth / 2 - e.clientX) / 25;
    const y = (window.innerHeight / 2 - e.clientY) / 25;
    setPosition({ x, y });
  };

  return (
    <div className="app">

      {/* =========================
          BACKGROUND EFFECTS
      ========================= */}
      <div className="background-effects">

        {/* GRID */}
        <div className="grid-bg"></div>

        {/* STARS */}
        <div className="stars stars-small"></div>
        <div className="stars stars-medium"></div>
        <div className="stars stars-large"></div>

        {/* GLOW ORBS */}
        <div className="glow glow-blue"></div>
        <div className="glow glow-purple"></div>
        <div className="glow glow-cyan"></div>

      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">

        <Navbar onConnectClick={() => setOpenModal(true)} />

        {/* HERO */}
        <section
          id="home"
          className="hero"
          onMouseMove={handleMouseMove}
        >
          <div className="hero-container">

            {/* LEFT */}
            <div className="hero-left">
              <h1 className="hero-title" data-aos="fade-up">
                Best way to encrypt,
                <br />
                back up, and{" "}
                <span className="text-secure">secure</span>
                <br />
                <span className="text-assets">your assets.</span>
              </h1>

              <p
                className="hero-subtitle"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Protect your assets with next-level security built for
                real-world threats.
              </p>

              <p
                className="hero-subtitle italic-subtext"
                data-aos="fade-up"
                data-aos-delay="150"
              >
                One mistake shouldn’t cost you everything.
                <br />
                Our system helps keep your crypto safe from hackers,
                scams, and unauthorized access — without requiring
                technical skills.
              </p>

              <div
                className="hero-buttons"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <button
                  className="btn-primary"
                  onClick={() => setOpenModal(true)}
                >
                  Connect Wallet
                </button>

                <button

  className="btn-secondary"
  onClick={() => navigate("/ledger-login")}
>
  Access Ledger
</button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="hero-right" data-aos="zoom-in">
              <div
                className="floating-main"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                }}
              >
                <img
                  src={web3Image}
                  alt="Web3 visual"
                />
              </div>
            </div>

          </div>
        </section>

        {/* STATS */}
        <section id="stats" className="stats">
          <div className="stat" data-aos="fade-up">
            <Stat end={200} suffix="+" />
            <p>Countries Covered</p>
          </div>

          <div
            className="stat"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Stat end={30} suffix=" Million" />
            <p>Global Investors</p>
          </div>

          <div
            className="stat"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Stat end={700} suffix="+" />
            <p>Secured Wallets</p>
          </div>

          <div
            className="stat"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <Stat
              end={1.36}
              decimals={2}
              prefix="$"
              suffix=" Billion"
            />
            <p>Secured Volume</p>
          </div>
        </section>

        {/* SECTIONS */}
        <SecureSection />

        <HowToGetStarted
          onConnectClick={() => setOpenModal(true)}
        />

        <WalletRecoverySection
          onConnectClick={() => setOpenModal(true)}
        />

        <FAQ
          onConnectClick={() => setOpenModal(true)}
        />

        <TrustedBy />

        <Newsletter />

        {/* CONNECT MODAL */}
        <ConnectModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        />

      </div>
    </div>
  );
}

/* =========================
   MAIN APP (ROUTES)
========================= */
function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/wallets" element={<WalletSelect />} />
      <Route path="/ledger-login" element={<LedgerLogin />} />
      <Route path="/ledger-register" element={<LedgerRegister />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/account-success" element={<AccountSuccess />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /> </ProtectedRoute>} />
    </Routes>
  );
}

export default App;