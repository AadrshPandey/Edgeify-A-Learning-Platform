import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StudentDashboard.css';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/dashboard/student`, {
          credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch dashboard data');
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
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  const { enrolledCourses = 0, completedVideos = 0, averageProgress = 0, recentHistory = [] } = dashboardData || {};

  return (
    <div className="student-dashboard-container">
      <div className="dashboard-header">
        <h2>My Dashboard</h2>
        <p>Welcome back! Here is a quick overview of your learning journey.</p>
      </div>

      <div className="dashboard-stats-grid">
        
        <div className="stat-card">
          <div className="stat-icon courses-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="stat-info">
            <h3>{enrolledCourses}</h3>
            <p>Enrolled Courses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon videos-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-info">
            <h3>{completedVideos}</h3>
            <p>Completed Videos</p>
          </div>
        </div>

        <div className="stat-card progress-card">
          <div className="stat-info w-100">
            <div className="progress-header">
              <p>Average Progress</p>
              <h3>{averageProgress}%</h3>
            </div>
            <div className="progress-track">
              <div 
                className="progress-fill" 
                style={{ width: `${averageProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recently Watched</h3>
          {recentHistory.length > 0 && (
            <a href="/profile?tab=history" className="view-all-link">View All History</a>
          )}
        </div>

        {recentHistory.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📺</div>
            <h4>No watch history yet</h4>
            <p>Start watching some courses and they will appear here!</p>
            <Link to="/courses" className="browse-btn">Browse Courses</Link>
          </div>
        ) : (
          <div className="history-list">
            {recentHistory.slice(0,5).map((item) => {
              const video = item.video_id;
              if (!video) return null;

              return (
                <div key={item._id} className="history-item">
                  <div className="history-thumbnail">
                    <img src={video.thumbnail || "https://via.placeholder.com/150x85?text=No+Thumbnail"} alt="thumbnail" />
                    <div className="play-overlay">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                  <div className="history-details">
                    <h4>{video.title || "Untitled Video"}</h4>
                    <p>Watched on {new Date(item.updatedAt).toLocaleDateString()}</p>
                    <Link to={`/courses/${video.course_id}/${video._id}`} className="resume-btn">Resume</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentDashboard;