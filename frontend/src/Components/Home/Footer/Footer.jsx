import React from 'react';
import logo from "../../../assets/edgeifylogo.png";
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        
        {/* Subtle Brand Identity */}
        <div className="brand">
          <img src={logo} alt="Edgeify" className="logo" />
          <span className="text">Edgeify</span>
        </div>

        {/* Simple Copyright */}
        <p className="copyright">
          &copy; {currentYear} All rights reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;