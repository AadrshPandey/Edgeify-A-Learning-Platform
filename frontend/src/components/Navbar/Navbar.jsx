import React from "react";
import { Navigate, NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/edgeifylogo.png";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const isCoursePage = location.pathname === "/Courses";

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `/api/v1/user/logout`,
        {
          method : "POST",
          credentials : "include"
        }
      );

      if(response.ok || response.status === 401){
        console.log("User logout Successfully");
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      console.log("logout failed on backend",error);
    }
  }

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

          {!user ? (
            <>
              <NavLink to="/Login" className="navlink" id="login">Log In</NavLink>
              <NavLink to="/Register" className="navlink" id="signup">Sign Up</NavLink>
            </>
            ) : (
            <>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
              <NavLink to="/Profile" className="navlink" id="profile">Profile</NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
