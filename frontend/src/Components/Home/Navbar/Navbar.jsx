import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from "../../../assets/edgeifylogo.png";
import './Navbar.css'; // Make sure this path is correct

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/user/logout', {
        method: "POST",
        credentials: "include"
      });

      setUser(null);
      navigate("/auth/login");
    } catch (error) {
      console.log("Logout Failed", error);
    }
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <div className="navbar-wrapper">
      <nav className="navbar-container">
        
        {/* Logo Section */}
        <div className="logo-section">
          <img
            src={logo}
            alt="logo"
            className="logo-image"
          />
          <Link to="/" className="logo-text">
            Edgeify
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="nav-links-container">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/courses" className={navLinkClass}>
            Courses
          </NavLink>

          {user && (
            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="auth-container">
          {!user ? (
            <>
              <Link to="/auth/login" className="btn-login">
                Login
              </Link>
              <Link to="/auth/register" className="btn-register">
                Register
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          )}
        </div>

      </nav>
    </div>
  );
};

export default Navbar;