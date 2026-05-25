import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/edgeifylogo.png";
import "./Navbar.css";

const Navbar = () => {

  const location = useLocation();
  const isCoursePage = location.pathname === "/Courses";

  return (
    <div className= {`navbar-wrapper ${isCoursePage ? "course-Mode":""}`}>
      <div className="navbar">
        <div className="name">
          <img src={logo} alt="no image"/>
          <h1>Edgeify</h1>
        </div>

        <div className="redirectlinks">
          <NavLink to="/" className="navlink" id="home">Home</NavLink>
          <NavLink to="/Courses" className="navlink" id="courses">Courses</NavLink>
          <NavLink to="/Login" className="navlink" id="login">Log In</NavLink>
          <NavLink to="/Register" className="navlink" id="signup">Sign Up</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
