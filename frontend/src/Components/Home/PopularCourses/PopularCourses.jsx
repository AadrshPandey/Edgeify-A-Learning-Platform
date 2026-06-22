import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PopularCourses.css';

const PopularCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPopularCourses = async () => {
      try {
        const res = await fetch('/api/v1/course/popular', { credentials: 'include' })
        const data = await res.json()
        setCourses(data.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPopularCourses()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="courses-wrapper">
      <div className="courses-container">

        <div className="courses-header">
          <h2 className="section-title">Popular Courses</h2>
          <button className="view-all-btn" onClick={() => navigate('/courses')}>
            View All
          </button>
        </div>

        {courses.length > 0 ? (
          <div className="courses-grid">
            {courses.map((course) => (
              <div
                key={course._id}
                className="course-card"
                onClick={() => navigate(`/courses/${course._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="course-image-container">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="course-image"
                  />
                  <span className="course-category-badge">
                    {course.category_id?.category_name}
                  </span>
                </div>

                <div className="course-content">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-instructor">{course.teacher_id?.fullName}</p>

                  <div className="course-rating">
                    <span className="star-icon">⭐</span>
                    <span className="rating-score">
                      {course.average_rating > 0 ? course.average_rating : 'New'}
                    </span>
                  </div>

                  <div className="course-footer">
                    <span className="course-price">${course.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No popular courses yet. Check back later!</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default PopularCourses;