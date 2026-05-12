import "./HowToGetStarted.css";
import { UserPlus, Wallet, ShieldCheck, Rocket } from "lucide-react";

function HowToGetStarted({ onConnectClick }) {
  return (
    <section id="how" className="how-section">

      {/* BACKGROUND GLOW */}
      <div className="section-glow glow-left"></div>
      <div className="section-glow glow-right"></div>

      {/* HEADER */}
      <div className="get-started-header">
        <h2>
          How To Get <span>Started</span>
        </h2>
      </div>

      {/* STEPS CONTAINER */}
      <div className="steps-wrapper">

        {/* STEP 1 */}
        <div className="step-card featured-card">
          <div className="step-icon">
            <UserPlus size={28} />
          </div>

          <h3>Connect wallet</h3>

          <p>
            Click connect wallet button.
          </p>

          <button className="btn-primary" onClick={onConnectClick}>
  Connect Wallet
</button>
        </div>

        {/* STEP 2 */}
        <div className="step-card">
          <div className="step-number">02</div>

          <h3>Select Wallet</h3>

          <p>
            Choose your preferred wallet to backup and click on connect.
          </p>
        </div>

        {/* STEP 3 */}
        <div className="step-card">
          <div className="step-number">03</div>

          <h3>Backup your wallet</h3>

          <p>
            Your wallet backup may also be referred to as a:
            <strong>
              backup, recovery seed, seed, seed phrase, BIP-39 seed phrase,
              mnemonic, recovery phrase.
            </strong>
          </p>
        </div>

        {/* STEP 4 */}
        <div className="step-card">
          <div className="step-number">04</div>

          <h3>Start your journey</h3>

          <p>
            Having a safe wallet backup means you can recover your assets in case
            of hardware failure or device loss.
          </p>
        </div>
      </div>

      {/* BOTTOM PARAGRAPH */}
      <div className="started-bottom-text">
        <p>
          No complicated setup. No technical knowledge needed.
        </p>
      </div>
    </section>
  );
}

export default HowToGetStarted;
