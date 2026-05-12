import { FaLock, FaDatabase, FaShieldAlt } from "react-icons/fa";

function Services() {
  return (
    <section className="services">
      <h2 className="services-title">Our Services</h2>

      <div className="services-container">
        
        <div className="service-card" data-aos="fade-up">
          <div className="service-icon">
            <FaLock />
          </div>
          <h3>Encryption</h3>
          <p>Advanced blockchain encryption to protect your digital assets.</p>
        </div>

        <div className="service-card" data-aos="fade-up" data-aos-delay="100">
          <div className="service-icon">
            <FaDatabase />
          </div>
          <h3>Backup</h3>
          <p>Secure and reliable backup systems for your important data.</p>
        </div>

        <div className="service-card" data-aos="fade-up" data-aos-delay="200">
          <div className="service-icon">
            <FaShieldAlt />
          </div>
          <h3>Security</h3>
          <p>Multi-layer protection ensuring your assets are always safe.</p>
        </div>

      </div>
    </section>
  );
}

export default Services;