import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>🕵️‍♂️ MysteryBox</h3>
            <p>Interactive Mystery Investigation and Case Resolution Platform.</p>
          </div>
          <div className="footer-meta">
            <p><strong>Lead Developer:</strong> K. V. GANESH KOUSHAL (24EG104A13)</p>
            <p>Department of Electronics and Communication Engineering</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} MysteryBox Platform. Powered by Spring Boot 3 & React.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
