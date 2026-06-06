import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
 
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Login Data:", formData);

    try {
      const response = await fetch(`/api/v1/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.data);
        
        navigate("/");
      } else {
        alert(data.message);
      }

      console.log(data);
    } catch (error) {
      console.log("Login Error:", error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <button
          type="button"
          className="back-home"
          onClick={() => navigate("/")}
        >
          Home
        </button>
        <h2>LOG-IN</h2>
        <p className="login-subtitle">
          Sign in to continue learning on Edgeify
        </p>

        <div className="input-group">
          <label htmlFor="username">Username</label>

          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>

          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>

        <p className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
