import React, { useState } from 'react';
import { BounceLoader } from 'react-spinners';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Home/Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';
import './Login.css';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useAuth(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/v1/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Invalid credentials');
      
      const data = await response.json();
      setUser(data.data);
      
      console.log("Logging in with:", credentials);
      navigate("/");

    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">

      {isLoading && (
        <div className="loading-overlay">
          <BounceLoader color="#0D51FB" size={60} speedMultiplier={1.5} />
          <p className="loading-text">Authenticating...</p>
        </div>
      )}

      <div className="login-navbar-container">
        <Navbar />
      </div>

      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Enter your credentials to access your account</p>
          </div>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className={`login-submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p>Don't have an account? <Link to="/auth/register">Register here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;