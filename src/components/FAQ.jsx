import "./FAQ.css";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import giftBox from "../assets/decor/gift-box.png";

function FAQ({ onConnectClick }) {

  const [activeIndex, setActiveIndex] = useState(0);

  const faqData = [
    {
      question: "How can I secure my wallet?",
      answer:
        "Set a unique passcode for your wallet. Also, make sure the numbers are random. Birthdays, anniversaries, house addresses, and the last digits of your phone number are all popular combinations and are crackable codes to a resourceful criminal.",
    },

    {
      question: "How to backup a crypto wallet?",
      answer:
        "1. Export Private Keys/Seed Phrase: Go to your wallet's settings and select the backup wallet or export keys option.\n\n2. Secure Your Backup: Store backups in multiple secure locations like USB drives, paper copies in fireproof safes, and safety deposit boxes.",
    },

    {
      question: "How to keep bitcoin wallet safe?",
      answer:
        "Securing Your Bitcoin. Choosing a Reputable Exchanges.",
    },

    {
      question: "How do I trust a safe wallet?",
      answer:
        "Back up your wallet.\n\nBe cautious of phishing scams.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section">

      {/* GLOWS */}
      <div className="faq-glow faq-glow-left"></div>
      <div className="faq-glow faq-glow-right"></div>

      {/* DECOR IMAGE */}
      <img
        src={giftBox}
        alt="gift decoration"
        className="faq-decor"
      />

      <div className="faq-container">

        {/* LEFT */}
        <div className="faq-left">

          <span className="faq-tag">
            FAQ
          </span>

          <h2>
            Your questions <span>answered.</span>
          </h2>

          <p>
            Let's do our best to answer your most frequently asked questions.
          </p>

          {/* SMALL CARD */}
          <div className="faq-contact-card">

            <div className="faq-icon">
              ?
            </div>

            <div>

              <h3>
                Still have questions?
              </h3>

              <p>
                Can't find the answer you're looking for?
                Please chat to our friendly team!
              </p>

              <button className="btn-primary" onClick={onConnectClick}>
  Connect Wallet
</button>

            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="faq-right">

          {faqData.map((item, index) => (

            <div
              key={index}
              className={`faq-item ${
                activeIndex === index ? "active" : ""
              }`}
            >

              {/* QUESTION */}
              <div
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >

                <h3>
                  {item.question}
                </h3>

                <div className="faq-arrow">
                  <ChevronDown size={22} />
                </div>
              </div>

              {/* ANSWER */}
              <div className="faq-answer">

                <p>
                  {item.answer}
                </p>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;