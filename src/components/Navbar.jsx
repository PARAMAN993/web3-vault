// src/components/Navbar.jsx

import { useState } from "react";
import "./Navbar.css";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({
  onConnectClick,
}) => {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const navigate =
    useNavigate();

  const toggleMenu =
    () => {
      setMenuOpen(
        !menuOpen
      );
    };

  const closeMenu =
    () => {
      setMenuOpen(false);
    };

  const handleLedgerClick =
    () => {
      navigate(
        "/ledger-login"
      );

      closeMenu();
    };

  const handleScroll =
    (id) => {
      const section =
        document.getElementById(
          id
        );

      if (section) {
        section.scrollIntoView({
          behavior:
            "smooth",
        });
      }

      closeMenu();
    };

  return (
    <nav className="navbar">

      <div className="nav-container">

        {/* LOGO */}
        <div className="logo">

          <span className="safe">
            Safe
          </span>

          <span className="web3">
            Web3
          </span>

          <span className="vault">
            Vault
          </span>

        </div>

        {/* DESKTOP LINKS */}
        <ul className="nav-links">

          <li>
            <button
              onClick={() =>
                handleScroll(
                  "howitworks"
                )
              }
            >
              HowItWorks
            </button>
          </li>

          <li>
            <button
              onClick={() =>
                handleScroll(
                  "stats"
                )
              }
            >
              Statistics
            </button>
          </li>

          <li>
            <button
              onClick={() =>
                handleScroll(
                  "recovery"
                )
              }
            >
              Recovery
            </button>
          </li>

          <li>
            <button
              onClick={() =>
                handleScroll(
                  "trustedby"
                )
              }
            >
              Trusted By
            </button>
          </li>

        </ul>

        {/* DESKTOP BUTTONS */}
        <div className="nav-buttons">

          <button
            className="connect-btn"
            onClick={
              onConnectClick
            }
          >
            Connect Wallet
          </button>

          <button
            className="ledger-btn"
            onClick={() =>
              navigate(
                "/ledger-login"
              )
            }
          >
            Access Ledger
          </button>

        </div>

        {/* HAMBURGER */}
        <button
          className="hamburger"
          onClick={
            toggleMenu
          }
        >
          {menuOpen ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>

      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu active">

          <button
            onClick={() =>
              handleScroll(
                "howitworks"
              )
            }
          >
            HowItWorks
          </button>

          <button
            onClick={() =>
              handleScroll(
                "stats"
              )
            }
          >
            Statistics
          </button>

          <button
            onClick={() =>
              handleScroll(
                "recovery"
              )
            }
          >
            Recovery
          </button>

          <button
            onClick={() =>
              handleScroll(
                "trustedby"
              )
            }
          >
            Trusted By
          </button>

          <div className="mobile-buttons">

            <button
              className="connect-btn"
              onClick={() => {
                onConnectClick();
                closeMenu();
              }}
            >
              Connect Wallet
            </button>

            <button
              className="ledger-btn"
              onClick={
                handleLedgerClick
              }
            >
              Access Ledger
            </button>

          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;