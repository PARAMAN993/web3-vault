import "./Newsletter.css";
import { useState } from "react";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://formspree.io/f/xlgzndbv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setEmail("");
        setSuccess(true);

        // auto close after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);

      } else {
        setError("Something went wrong. Try again.");
      }

    } catch (err) {
      setError("Network error. Check your connection.");
    }

    setLoading(false);
  };

  return (
    <>
      <section className="newsletter">

        <h2 className="newsletter-title">Newsletter</h2>

        <p className="newsletter-text">
          Welcome to Safe Web3 Networks your gateway to the world <br />
          of Web3 trading! Our user-friendly platform
        </p>

        <form className="newsletter-input" onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" className="newsletter-btn">
            {loading ? "..." : "→"}
          </button>

        </form>

        {error && <p className="newsletter-error">{error}</p>}

        <p className="newsletter-copy">
          Copyright © 2026 Safe Web3 Vault
        </p>

      </section>

      {/* SUCCESS MODAL */}
      {success && (
        <div className="success-overlay">
          <div className="success-box">
            <div className="checkmark">✔</div>
            <h3>Subscribed Successfully</h3>
            <p>You’ve joined Safe Web3 Vault</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Newsletter;