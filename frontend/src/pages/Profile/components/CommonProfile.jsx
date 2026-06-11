import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import "./CommonProfile.css";
import { ClipLoader } from "react-spinners";

const CommonProfile = () => {
  const { user, setUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const [showPictureForm, setShowPictureForm] = useState(false);

  const [profilePic, setProfilePic] = useState(null);

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [showEditForm, setShowEditForm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    setLoading(true);
      const response = await fetch("/api/v1/user/profile", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.data);
        setShowEditForm(false);
        alert("Profile Updated Successfully");
      }
    } catch (error) {
      console.log("error in form submit", error);
    } finally {
        setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setShowEditForm(true);
  };

  const handleChangePassword = () => {
    setShowPasswordForm(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordData.oldPassword || !passwordData.newPassword) {
      alert("Please fill all fields");
      return;
    }

    try {
        setLoading(true);
      const response = await fetch("/api/v1/user/change-password", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Password Changed Successfully");

        setShowPasswordForm(false);

        setPasswordData({
          oldPassword: "",
          newPassword: "",
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("Error in pass form", error);
    } finally {
        setLoading(false);
    }
  };

  const handlePictureSubmit = async (e) => {
    e.preventDefault();

    if (!profilePic) {
      alert("Please select an image");
      return;
    }

    try {
        setLoading(true);
      const formData = new FormData();

      formData.append("profile_Pic", profilePic);

      const response = await fetch("/api/v1/user/change-profilePic", {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.data);

        alert("Profile Picture Updated Successfully");

        setShowPictureForm(false);

        setProfilePic(null);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("Error updating picture", error);
    } finally {
        setLoading(false);
    }
  };

  const handleUpdatePicture = () => {
    setShowPictureForm(true);
  };

  return (
    <div>
      {showEditForm && (
        <div className="editModal">
          <form className="editForm" onSubmit={handleSubmit}>
            <h2>Edit Profile</h2>

            <label>Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fullName: e.target.value,
                })
              }
            />

            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
            />

            <label>Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bio: e.target.value,
                })
              }
            />

            <div className="formButtons">
              <button type="submit" className="saveBtn">
                {loading ? <ClipLoader size={20}/> : "Save Changes"}
              </button>

              <button
                type="button"
                className="cancelBtn"
                onClick={() => setShowEditForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showPasswordForm && (
        <div className="editModal">
          <form className="editForm" onSubmit={handlePasswordSubmit}>
            <h2>Change Password</h2>

            <label>Current Password</label>

            <input
              type="password"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  oldPassword: e.target.value,
                })
              }
            />

            <label>New Password</label>

            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />

            <div className="formButtons">
              <button type="submit" className="saveBtn">
                
                {loading ? <ClipLoader size={20}/> : "Change Password"}
              </button>

              <button
                type="button"
                className="cancelBtn"
                onClick={() => setShowPasswordForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showPictureForm && (
        <div className="editModal">
          <form className="editForm" onSubmit={handlePictureSubmit}>
            <h2>Update Profile Picture</h2>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePic(e.target.files[0])}
            />

            <div className="formButtons">
              <button type="submit" className="saveBtn">
                {loading ? <ClipLoader size={20}/> : "Upload"}
              </button>

              <button
                type="button"
                className="cancelBtn"
                onClick={() => {
                  setShowPictureForm(false);
                  setProfilePic(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="commonProfile">
        <div className="profileTop">
          <img src={user?.profile_Pic} alt="Profile" className="profilePic" />

          <div className="profileInfo">
            <h1>{user?.fullName}</h1>

            <p className="username">@{user?.username}</p>

            <p>
              <strong>Email:</strong> {user?.email}
            </p>

            <p>
              <strong>Role:</strong> {user?.role}
            </p>

            <p className="bio">{user?.bio || "No bio available"}</p>

            <p>
              <strong>Joined:</strong>{" "}
              {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="profileActions">
          <button onClick={handleEditProfile}>Edit Profile</button>

          <button onClick={handleChangePassword}>Change Password</button>

          <button onClick={handleUpdatePicture}>Update Picture</button>
        </div>
      </div>
    </div>
  );
};

export default CommonProfile;
