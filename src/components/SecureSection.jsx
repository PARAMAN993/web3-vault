import "./SecureSection.css";

import dapps from "../assets/features/dapps.png";
import missing from "../assets/features/missing.png";
import high from "../assets/features/highfee.png";
import support from "../assets/features/support.png";
import secure from "../assets/features/secure.png";

function SecureSection() {
  return (
    <section id="security" className="secure-section">

      {/* HEADER */}
      <div className="features-header">
        <h2>
          Find & Secure <span className="highlight">crypto</span> Now!
        </h2>

        <p>
          Our comprehensive cybersecurity platform, driven by artificial intelligence,
          not only safeguards your organization.
        </p>
      </div>

      {/* GRID */}
      <div className="features-grid">

        {/* CONNECT TO DAPPS (BIG CARD) */}
        <div className="feature-card card-dapps">
          <h3>Connect to Dapps</h3>
          <p>
            Connect decentralized apps to mobile wallets and enable DAPP.
          </p>
          <img src={dapps} alt="dapps" />
        </div>

        {/* MISSING FUNDS */}
        <div className="feature-card card-missing">
          <h3>Missing Funds</h3>
          <p>
            Lost access to funds or missing funds? Click here.
          </p>
          <img src={missing} alt="missing funds" />
        </div>

        {/* HIGH FEE */}
        <div className="feature-card card-high">
          <h3>High Fee</h3>
          <p>
            Transaction fees too high? Click here.
          </p>
          <img src={high} alt="high fee" />
        </div>

        {/* 24/7 SUPPORT */}
        <div className="feature-card card-support">
          <h3>24/7 Support</h3>
          <p>
            Count on us for round-the-clock support, help whenever you need it.
          </p>
          <img src={support} alt="support" />
        </div>

        {/* TRUSTED & SECURE */}
        <div className="feature-card card-secure">
          <h3>Trusted & Secure</h3>
          <p>
            Your assets. On your terms. At your fingertips.
          </p>
          <img src={secure} alt="secure" />
        </div>

      </div>
    </section>
  );
}

export default SecureSection;