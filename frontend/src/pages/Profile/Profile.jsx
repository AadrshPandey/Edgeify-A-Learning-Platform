import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Home/Navbar/Navbar';
import Footer from '../../Components/Home/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import UpdateProfile from '../../Components/Profile/UpdateProfile/UpdateProfile';
import StudentDashboard from '../../Components/Profile/StudentDashboard/StudentDashboard';
import TeacherDashboard from '../../Components/Profile/TeacherDashboard/TeacherDashboard';
import MyCoursesStudent from '../../Components/Profile/MyCoursesStudent/MyCoursesStudent';
import MyCoursesTeacher from '../../Components/Profile/MyCoursesTeacher/MyCoursesTeacher';
import MyHistory from '../../Components/Profile/MyHistory/MyHistory';
import MyCategories from '../../Components/Profile/MyCategories/MyCategories';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#343537] border-t-[#0D51FB] rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium tracking-wide">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      <Navbar />
      
      <div className="profile-container">
        
        {/* --- SIDEBAR NAVIGATION --- */}
        <aside className="profile-sidebar">
          <div className="sidebar-nav-group">
            
            <button 
              onClick={() => setActiveTab('profile')}
              className={`sidebar-btn ${activeTab === 'profile' ? 'active' : ''}`}
            >
              Account Settings
            </button>
            
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`sidebar-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </button>

            {/* TEACHER SPECIFIC TABS */}
            {user.role === 'teacher' && (
              <>
                <button 
                  onClick={() => setActiveTab('categories')}
                  className={`sidebar-btn ${activeTab === 'categories' ? 'active' : ''}`}
                >
                  My Categories
                </button>
                <button 
                  onClick={() => setActiveTab('courses')}
                  className={`sidebar-btn ${activeTab === 'courses' ? 'active' : ''}`}
                >
                  My Courses
                </button>
              </>
            )}

            {/* STUDENT SPECIFIC TABS */}
            {user.role === 'student' && (
              <>
                <button 
                  onClick={() => setActiveTab('courses')}
                  className={`sidebar-btn ${activeTab === 'courses' ? 'active' : ''}`}
                >
                  My Enrollments
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`sidebar-btn ${activeTab === 'history' ? 'active' : ''}`}
                >
                  Watch History
                </button>
              </>
            )}

          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="profile-main-content">
          <div className="tab-fade-in">
            
            {/* Shared Content */}
            {activeTab === 'profile' && <UpdateProfile />}

            {/* Student Content */}
            {user.role === 'student' && (
              <>
                {activeTab === 'dashboard' && <StudentDashboard />}
                {activeTab === 'courses' && <MyCoursesStudent />}
                {activeTab === 'history' && <MyHistory />}
              </>
            )}

            {/* Teacher Content */}
            {user.role === 'teacher' && (
              <>
                {activeTab === 'dashboard' && <TeacherDashboard />}
                {activeTab === 'categories' && <MyCategories />}
                {activeTab === 'courses' && <MyCoursesTeacher />}
              </>
            )}

          </div>
        </main>

      </div>

      <Footer />      
    </div>
  );
};

export default Profile;