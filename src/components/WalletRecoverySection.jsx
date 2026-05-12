import "./WalletRecoverySection.css";

import recoveryImage from "../assets/recovery/recovery-phone.png";
import bitcoin from "../assets/decor/bitcoin.png";
import planetGlow from "../assets/decor/planet-glow.png";

function WalletRecoverySection({ onConnectClick }) {
  return (
    <section id="recovery" className="recovery-section">

      <img
        src={planetGlow}
        alt=""
        className="recovery-planet"
      />
      
      <div className="recovery-content">
      <div className="recovery-image-wrapper">
        <img
          src={recoveryImage}
          alt="wallet recovery"
          className="recovery-image"
        />
      </div>

      <div className="recovery-card">

        <h2>
          How does wallet backup <br />
          and recovery work?
        </h2>

        <h3>Secure</h3>

        <p>
          First, we need to talk a little bit about how crypto
          wallets work. Crypto wallets work by holding
          cryptographic keys that are used to prove you have
          control over your cryptoassets2 on a blockchain.
        </p>

        <p>
          Whenever you wish to do something with your
          cryptoassets2, you instruct the blockchain and use
          your private cryptographic key as a sort of digital
          signature to approve your desired action.
        </p>

       <button className="btn-primary" onClick={onConnectClick}>
  Connect Wallet
</button>

      
      </div>
      </div>

      <img
        src={bitcoin}
        alt=""
        className="recovery-bitcoin"
      />

    </section>
  );
}

export default WalletRecoverySection;