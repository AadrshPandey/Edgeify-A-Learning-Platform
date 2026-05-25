import React from "react";
import logo from "../../assets/edgeifylogo.png";
import location from "../../assets/location.png";
import mail from "../../assets/mail.png"
import './Footer.css'

const Footer = () => {
  return (
    <div className="footer">
      <div className="name">
        <img src={logo} alt="no image" />
        <h1>Edgeify</h1>
      </div>

      <div className="contact">
        <div className="contactus">Contact Us:- 9315704198</div>
        <div className="location">
          <img src={location} alt="" className="mapimage" />Near Sai Kripa Garden, Sarpanch Colony, Surya Vihar-2, Sehatpur, Faridabad, Haryana, Pin Code-121013
        </div>
        <div className="email">
          <img src={mail} alt="" />
          <p>ap601130@gmail.com</p>
        </div>
        <div className="copyright">© 2025 Edgeify. All Rights Reserved</div>
      </div>
    </div>
  );
};

export default Footer;
