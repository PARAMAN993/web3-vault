import "./TrustedBy.css";
import lattice from "../assets/trusted/lattice.png";
import monday from "../assets/trusted/monday.png";
import pendo from "../assets/trusted/pendo.png";
import pingdom from "../assets/trusted/pingdom.png";
import prismic from "../assets/trusted/prismic.png";
import krisp from "../assets/trusted/krisp.png";
import gitlab from "../assets/trusted/gitlab.png";
import dropbox from "../assets/trusted/dropbox.png";
import unsplash from "../assets/trusted/unsplash.png";
import jotform from "../assets/trusted/jotform.png";
import voiceflow from "../assets/trusted/voiceflow.png";

function TrustedBy() {
  const row1 = [
    lattice, monday, pendo, pingdom, prismic,
    krisp, gitlab, dropbox, unsplash, jotform, voiceflow
  ];

  const row2 = [
    voiceflow, jotform, unsplash, dropbox, gitlab,
    krisp, prismic, pingdom, pendo, monday, lattice
  ];

  return (
    <section id="trusted" className="trusted">
      <h2 className="trusted-title">Trusted by</h2>

      {/* ROW 1 (RIGHT) */}
      <div className="marquee">
        <div className="marquee-track right">
          {[...row1, ...row1].map((logo, i) => (
            <img key={i} src={logo} alt="brand" />
          ))}
        </div>
      </div>

      {/* ROW 2 (LEFT) */}
      <div className="marquee">
        <div className="marquee-track left">
          {row2.concat(row2).map((logo, i) => (
            <img key={i} src={logo} alt="brand" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustedBy;