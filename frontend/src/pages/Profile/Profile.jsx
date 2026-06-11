import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import CommonProfile from "./components/commonProfile";
import StudentDashboard from "./components/student/StudentDashboard";
import TeacherDashboard from "./components/teacher/TeacherDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import Navbar from "../../components/Navbar/Navbar";
import "./Profile.css";

const Profile = () => {
  const { user, loading } = useAuth();

  if(loading){
    return <h2>Loading...</h2>
  }

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="profilePage">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="profileContent">
        <CommonProfile />

        {user.role === "student" && <StudentDashboard />}
        {user.role === "teacher" && <TeacherDashboard />}
        {user.role === "admin" && <AdminDashboard />}
      </div>
    </div>
  );
};

export default Profile;
