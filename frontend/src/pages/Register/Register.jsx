import React, { useState } from 'react';
import { BounceLoader } from 'react-spinners';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Home/Navbar/Navbar'; // Adjust path if needed
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    bio: ''
  });
  
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('username', formData.username);
      submitData.append('fullName', formData.fullName);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('role', formData.role);
      submitData.append('bio', formData.bio);
      
      if (profilePic) {
        submitData.append('profile_Pic', profilePic); 
      }

      const response = await fetch('/api/v1/user/register', {
        method: 'POST',
        // Note: DO NOT set 'Content-Type' manually when using FormData. 
        // The browser will automatically set it to 'multipart/form-data' with the correct boundary.
        body: submitData 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      console.log("Registering user data...");
      
        navigate('/auth/login');

    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
     
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page-wrapper">

      {isLoading && (
        <div className="loading-overlay">
          {/* Drop the react-spinner here instead of the CSS div */}
          <BounceLoader color="#0D51FB" size={60} speedMultiplier={1.5} />
          <p className="loading-text">Authenticating...</p>
        </div>
      )}

      <div className="register-navbar-container">
        <Navbar />
      </div>

      <div className="register-content">
        {/* Unified, single-column card */}
        <div className="register-card">
          
          <div className="register-header">
            <h2>Create an Account</h2>
            <p>Join Edgeify and start learning today</p>
          </div>

          {error && <div className="register-error">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            
            {/* Top Centered Profile Picture Section */}
            <div className="profile-upload-section">
              <div className="profile-image-circle">
                {profilePicPreview ? (
                  <img src={profilePicPreview} alt="Preview" className="profile-img" />
                ) : (
                  <div className="dummy-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                )}
              </div>
              <label htmlFor="profilePic" className="upload-text-btn">
                {profilePic ? 'Change Photo' : 'Upload Photo'}
              </label>
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden-file-input"
              />
            </div>

            {/* Form Inputs */}
            <div className="register-form-row">
              <div className="register-input-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" placeholder="ap123" value={formData.username} onChange={handleChange} required />
              </div>
              <div className="register-input-group">
                <label htmlFor="fullName">Full Name</label>
                <input type="text" id="fullName" name="fullName" placeholder="Aadrsh Pandey" value={formData.fullName} onChange={handleChange} required />
              </div>
            </div>

            <div className="register-form-row">
              <div className="register-input-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="ap@example.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="register-input-group">
                <label htmlFor="role">I am a...</label>
                <select id="role" name="role" value={formData.role} onChange={handleChange} className="register-select">
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
            </div>

            <div className="register-form-row">
              <div className="register-input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="register-input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            <div className="register-input-group">
              <label htmlFor="bio">Short Bio (Optional)</label>
              <textarea id="bio" name="bio" placeholder="Tell us a little about yourself..." value={formData.bio} onChange={handleChange} rows="2" className="register-textarea"></textarea>
            </div>

            <button type="submit" className={`register-submit-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="register-footer">
            <p>Already have an account? <Link to="/auth/login">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;