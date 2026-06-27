import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './UpdateProfile.css';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const UpdateProfile = () => {
  const {user, setUser} = useAuth();

  const [details, setDetails] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });

  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(user?.profile_Pic || '');

  // --- Status States ---
  const [loadingType, setLoadingType] = useState(null); 
  const [message, setMessage] = useState({ type: '', text: '' });

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  const submitDetails = async (e) => {
    e.preventDefault();
    setLoadingType('details');
    
    try {
      const response = await fetch(`${BASE_URL}/api/v1/user/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update details');

      setUser(data.data); 
      setMessage({ type: 'success', text: 'Account details updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoadingType(null);
    }
  };

  const submitProfilePic = async (e) => {
    e.preventDefault();
    if (!profilePic) return;
    setLoadingType('pic');

    try {
      const formData = new FormData();
      formData.append('profile_Pic', profilePic); 

      const response = await fetch(`${BASE_URL}/api/v1/user/change-profilePic`, {
        method: 'PATCH',
        body: formData,
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update photo');

      setUser(prev => ({ ...prev, profile_Pic: previewPic }));
      setProfilePic(null);
      setMessage({ type: 'success', text: 'Profile photo updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoadingType(null);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setMessage({ type: 'error', text: 'New passwords do not match' });
    }

    setLoadingType('password');

    try {
      const response = await fetch(`${BASE_URL}/api/v1/user/change-password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword
        }),
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to change password');

      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="update-profile-container">
      <div className="update-profile-header">
        <h2>Account Settings</h2>
        <p>Manage your profile information and security.</p>
      </div>

      {message.text && (
        <div className={`status-banner ${message.type}`}>
          {message.text}
        </div>
      )}

      <section className="update-section">
        <h3>Profile Picture</h3>
        <div className="profile-pic-editor">
          <div className="pic-preview-circle">
            {previewPic ? (
              <img src={previewPic} alt="Profile" />
            ) : (
              <div className="pic-placeholder">No Image</div>
            )}
          </div>
          
          <div className="pic-actions">
            <label htmlFor="profileUpload" className="pic-upload-btn">
              Select New Photo
            </label>
            <input 
              type="file" 
              id="profileUpload" 
              accept="image/*" 
              onChange={handleFileChange} 
              hidden 
            />
            {profilePic && (
              <button 
                onClick={submitProfilePic} 
                disabled={loadingType === 'pic'}
                className="pic-save-btn"
              >
                {loadingType === 'pic' ? 'Saving...' : 'Upload Photo'}
              </button>
            )}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      <section className="update-section">
        <h3>Personal Information</h3>
        <form onSubmit={submitDetails} className="update-form">
          
          <div className="form-row">
            <div className="input-box">
              <label>Username (Cannot be changed)</label>
              <input type="text" value={user?.username || ''} disabled className="disabled-input" />
            </div>
            <div className="input-box">
              <label>Full Name</label>
              <input type="text" name="fullName" value={details.fullName} onChange={handleDetailsChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="input-box">
              <label>Email Address</label>
              <input type="email" name="email" value={details.email} onChange={handleDetailsChange} required />
            </div>
          </div>

          <div className="input-box">
            <label>Bio</label>
            <textarea name="bio" value={details.bio} onChange={handleDetailsChange} rows="3" placeholder="Tell us about yourself..." />
          </div>

          <button type="submit" disabled={loadingType === 'details'} className="submit-btn">
            {loadingType === 'details' ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </section>

      <hr className="section-divider" />

      <section className="update-section">
        <h3>Security</h3>
        <form onSubmit={submitPassword} className="update-form">
          
          <div className="input-box">
            <label>Current Password</label>
            <input type="password" name="oldPassword" value={passwords.oldPassword} onChange={handlePasswordChange} required />
          </div>

          <div className="form-row">
            <div className="input-box">
              <label>New Password</label>
              <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} required minLength="6" />
            </div>
            <div className="input-box">
              <label>Confirm New Password</label>
              <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} required minLength="6" />
            </div>
          </div>

          <button type="submit" disabled={loadingType === 'password'} className="submit-btn password-btn">
            {loadingType === 'password' ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </section>

    </div>
  );
};

export default UpdateProfile;