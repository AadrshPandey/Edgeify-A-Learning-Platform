import React from 'react';
import logo from "../../../assets/edgeifylogo.png";
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-brand">
          <img src={logo} alt="Edgeify" className="logo" />
          <span className="brand-name">Edgeify</span>
        </div>

        <p className="copyright">
          &copy; {currentYear} Edgeify Learning. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;