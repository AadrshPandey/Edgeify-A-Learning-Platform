import React from "react";
import { useState } from "react";
import "./Register.css";
import defaultPhoto from "../../assets/defaultPhoto.png";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    role: "Student",
    bio: "",
  });

  const [profile_Pic, setProfile_Pic] = useState(null);
  const [preview, setPreview] = useState(defaultPhoto);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile_Pic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("form is getting to submit");

    const dataToSend = new FormData();

    dataToSend.append("username", formData.username);
    dataToSend.append("fullName", formData.fullName);
    dataToSend.append("email", formData.email);
    dataToSend.append("password", formData.password);
    dataToSend.append("role", formData.role);
    dataToSend.append("bio", formData.bio);

    if (profile_Pic) {
      dataToSend.append("profile_Pic", profile_Pic);
    }

    try {
      const response = await fetch(
        `/api/v1/user/register`,

        {
          method: "POST",

          body: dataToSend,
        },
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        alert(data.data);
      }
      console.log(data);
    } catch (error) {
      console.log("error while fetching from frontend !!", error);
    }
  };

  return (
    <div className="form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <button
          type="button"
          className="back-home"
          onClick={() => navigate("/")}
        >
          Home
        </button>
        <h2>Create an Account</h2>
        <div className="form-split-body">
          <div className="avatar-upload-section">
            <div className="avatar-preview">
              <img src={preview} alt="Profile Preview" />
            </div>
            <div className="avatar-input-wrapper">
              <label htmlFor="profile_Pic" className="avatar-label">
                Choose Profile Photo
              </label>
              <input
                type="file"
                id="profile_Pic"
                name="profile_Pic"
                accept="image/*"
                className="avatar-file-input"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
        <div className="form-inputs-right">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="e.g., aadrsh456"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="e.g., Aadrsh Pandey"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">I am a</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Sign Up
        </button>

        <p className="login-link">
          Already Registered ? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
