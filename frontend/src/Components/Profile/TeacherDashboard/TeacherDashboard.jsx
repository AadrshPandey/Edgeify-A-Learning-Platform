import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Adjust this URL if your router uses a different path in app.js
        const response = await fetch('/api/v1/dashboard/teacher', {
          credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch teacher dashboard');
        }

        setDashboardData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="teacher-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teacher-dashboard-error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  // Destructure the data sent from your backend
  const { 
    totalCourses = 0, 
    totalVideos = 0, 
    totalStudents = 0, 
    averageRating = 0, 
    totalReviews = 0 
  } = dashboardData || {};

  return (
    <div className="teacher-dashboard-container">
      <div className="dashboard-header">
        <h2>Instructor Dashboard</h2>
        <p>Here is an overview of your teaching impact and content.</p>
      </div>

      {/* --- STATS GRID --- */}
      <div className="teacher-stats-grid">
        
        {/* Total Students */}
        <div className="teacher-stat-card">
          <div className="stat-icon students-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="stat-info">
            <h3>{totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>

        {/* Total Courses */}
        <div className="teacher-stat-card">
          <div className="stat-icon courses-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="stat-info">
            <h3>{totalCourses}</h3>
            <p>Published Courses</p>
          </div>
        </div>

        {/* Total Videos */}
        <div className="teacher-stat-card">
          <div className="stat-icon videos-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="stat-info">
            <h3>{totalVideos}</h3>
            <p>Total Videos</p>
          </div>
        </div>

        {/* Average Rating */}
        <div className="teacher-stat-card rating-card">
          <div className="stat-icon rating-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div className="stat-info">
            <h3>{averageRating} <span className="text-sm font-normal text-gray-400">/ 5.0</span></h3>
            <p>Based on {totalReviews} reviews</p>
          </div>
        </div>

      </div>

      {/* --- QUICK ACTIONS SECTION --- */}
      <div className="teacher-quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          
          <button 
            className="action-btn primary-action"
            onClick={() => alert("Navigate to Course Creation Modal/Page")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <div className="action-text">
              <h4>Create New Course</h4>
              <p>Start a new learning journey</p>
            </div>
          </button>

          <button 
            className="action-btn secondary-action"
            onClick={() => alert("Switch to Categories Tab")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <div className="action-text">
              <h4>Manage Categories</h4>
              <p>Organize your curriculum</p>
            </div>
          </button>

        </div>
      </div>

    </div>
  );
};

export default TeacherDashboard;