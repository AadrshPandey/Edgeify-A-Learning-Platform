import React, { useState } from 'react';
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
import { useSearchParams } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';
  
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabClick = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

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
        
        <aside className="profile-sidebar">
          
          <div className="sidebar-nav-group">
            <h3 className="sidebar-section-title" style={{ fontSize: '0.75rem', color: '#8E8F91', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem 0.5rem' }}>Account</h3>
            <button 
              onClick={() => handleTabClick('profile')}
              className={`sidebar-btn ${activeTab === 'profile' ? 'active' : ''}`}
            >
              Account Settings
            </button>
          </div>

          {user.role === 'teacher' && (
            <div className="sidebar-nav-group" style={{ marginTop: '1.5rem' }}>
              <h3 className="sidebar-section-title" style={{ fontSize: '0.75rem', color: '#8E8F91', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem 0.5rem' }}>Teaching</h3>
              
              <button 
                onClick={() => handleTabClick('teacher-dashboard')}
                className={`sidebar-btn ${activeTab === 'teacher-dashboard' ? 'active' : ''}`}
              >
                Instructor Dashboard
              </button>
              
              <button 
                onClick={() => handleTabClick('teacher-courses')}
                className={`sidebar-btn ${activeTab === 'teacher-courses' ? 'active' : ''}`}
              >
                Manage Curriculum
              </button>
              
              <button 
                onClick={() => handleTabClick('categories')}
                className={`sidebar-btn ${activeTab === 'categories' ? 'active' : ''}`}
              >
                My Categories
              </button>
            </div>
          )}

          <div className="sidebar-nav-group" style={{ marginTop: '1.5rem' }}>
            <h3 className="sidebar-section-title" style={{ fontSize: '0.75rem', color: '#8E8F91', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem 0.5rem' }}>Learning</h3>
            
            {user.role === 'student' && (
              <button 
                onClick={() => handleTabClick('student-dashboard')}
                className={`sidebar-btn ${activeTab === 'student-dashboard' ? 'active' : ''}`}
              >
                Student Dashboard
              </button>
            )}

            <button 
              onClick={() => handleTabClick('enrolled-courses')}
              className={`sidebar-btn ${activeTab === 'enrolled-courses' ? 'active' : ''}`}
            >
              My Learning
            </button>

            <button 
              onClick={() => handleTabClick('history')}
              className={`sidebar-btn ${activeTab === 'history' ? 'active' : ''}`}
            >
              Watch History
            </button>
          </div>

        </aside>

        <main className="profile-main-content">
          <div className="tab-fade-in">
            
            {activeTab === 'profile' && <UpdateProfile />}

            {activeTab === 'teacher-dashboard' && <TeacherDashboard />}
            {activeTab === 'teacher-courses' && <MyCoursesTeacher />}
            {activeTab === 'categories' && <MyCategories />}

            {activeTab === 'student-dashboard' && <StudentDashboard />}
            {activeTab === 'enrolled-courses' && <MyCoursesStudent />}
            {activeTab === 'history' && <MyHistory />}

          </div>
        </main>

      </div>

      <Footer />      
    </div>
  );
};

export default Profile;