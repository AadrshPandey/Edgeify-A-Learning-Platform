import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyCoursesStudent.css';

const MyCoursesStudent = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyEnrollments = async () => {
      try {
        // Adjust this endpoint based on your actual enrollment routes
        const response = await fetch('/api/v1/enrollment/my-enrollments', {
          credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch enrolled courses');
        }

        setEnrollments(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyEnrollments();
  }, []);

  if (isLoading) {
    return (
      <div className="student-courses-loading">
        <div className="spinner"></div>
        <p>Loading your learning journey...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-courses-error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="my-learning-container">
      
      <div className="learning-header">
        <div>
          <h2>My Learning</h2>
          <p>Pick up right where you left off and track your progress.</p>
        </div>
        <Link to="/courses" className="browse-courses-btn">
          Browse More Courses
        </Link>
      </div>

      {/* --- ENROLLMENTS GRID --- */}
      {enrollments.length === 0 ? (
        <div className="empty-learning-state">
          <div className="empty-icon">🎓</div>
          <h3>You haven't enrolled in any courses yet!</h3>
          <p>Explore our catalog to find your next favorite subject.</p>
          <Link to="/courses" className="explore-btn">Explore Catalog</Link>
        </div>
      ) : (
        <div className="learning-grid">
          {enrollments.map((enrollment) => {
            // Safely extract the nested course object
            const course = enrollment.course_id; 
            
            // If for some reason the course was deleted from the DB but enrollment exists
            if (!course) return <div>Nothing to show</div>;

            const progress = enrollment.progress_percentage || 0;
            const isCompleted = progress === 100;

            return (
              <div key={enrollment._id} className="learning-card">
                <div className="learning-img-container">
                  <img 
                    src={course.thumbnail || "https://via.placeholder.com/300x150?text=Course+Thumbnail"} 
                    alt={course.title} 
                  />
                  {isCompleted && (
                    <div className="completed-badge">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      Completed
                    </div>
                  )}
                </div>
                
                <div className="learning-content">
                  <div className="learning-meta">
                    <span>{course.level || 'All Levels'}</span>
                    <span>•</span>
                    {/* Assuming you populated the teacher_id to get the name */}
                    <span>{course.teacher_id?.fullName || 'Instructor'}</span>
                  </div>
                  
                  <h3>{course.title}</h3>
                  
                  <div className="progress-section">
                    <div className="progress-labels">
                      <span className="progress-text">{progress}% Complete</span>
                    </div>
                    <div className="learning-progress-track">
                      <div 
                        className={`learning-progress-fill ${isCompleted ? 'completed-fill' : ''}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="learning-actions">
                    <Link to={`/courses/${course._id}`} className="resume-course-btn">
                      {progress === 0 ? 'Start Course' : isCompleted ? 'Watch Again' : 'Resume Course'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default MyCoursesStudent;