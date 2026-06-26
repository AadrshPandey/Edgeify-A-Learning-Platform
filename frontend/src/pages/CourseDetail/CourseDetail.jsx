import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../Components/Home/Navbar/Navbar';
import Footer from '../../Components/Home/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import './CourseDetail.css';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // --- States ---
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  const [isUserEnrolled, setIsUserEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState('');

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true);
      try {
        // We use Promise.all to fetch everything at the exact same time to make the page load faster
        const [courseRes, videoRes, reviewRes] = await Promise.all([
          fetch(`/api/v1/course/${courseId}`),
          fetch(`/api/v1/video/course/${courseId}`),
          fetch(`/api/v1/review/allReviews/${courseId}`)
        ]);

        const courseData = await courseRes.json();
        const videoData = await videoRes.json();
        const reviewData = await reviewRes.json();

        if (!courseRes.ok) throw new Error(courseData.message || 'Course not found');

        setCourse(courseData.data);
        setVideos(videoData.data || []);
        setReviews(reviewData.data || []);

        // Check Enrollment status ONLY if the user is logged in
        if (user) {
          const enrollRes = await fetch(`/api/v1/enrollment/is-enrolled/${courseId}`, {
            credentials: 'include'
          });
          
          if (enrollRes.ok) {
            setIsUserEnrolled(true);
          } else {
            // Backend throws 400 if not enrolled. We just set state to false, not throw an error!
            setIsUserEnrolled(false); 
          }
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, user]);

  // --- ENROLLMENT HANDLER ---
  const handleEnroll = async () => {
    if (!user) {
      // If they aren't logged in, send them to login, then they can come back
      navigate('/auth/login');
      return;
    }

    if (user.role === 'teacher' && course?.teacher_id === user._id) {
      alert("You are the creator of this course!");
      return;
    }

    setIsEnrolling(true);
    try {
      const response = await fetch(`/api/v1/enrollment/enroll/${courseId}`, {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to enroll');
      
      setIsUserEnrolled(true);
      // Optional: Redirect them straight to the first video
      // if (videos.length > 0) navigate(`/courses/${courseId}/${videos[0]._id}`);

    } catch (err) {
      alert(err.message);
    } finally {
      setIsEnrolling(false);
    }
  };

  // --- HELPER MATH ---
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  // --- RENDER STATES ---
  if (isLoading) return <div className="course-detail-loading"><div className="spinner"></div></div>;
  if (error) return <div className="course-detail-error"><h2>Oops!</h2><p>{error}</p><Link to="/courses">Go back to courses</Link></div>;
  if (!course) return null;

  return (
    <div className="course-detail-wrapper">
      <Navbar />

      {/* --- HERO BANNER --- */}
      <div className="course-hero-banner">
        <div className="course-hero-content">
          <div className="hero-breadcrumbs">
            <Link to="/courses">Courses</Link> / <span>{course.level}</span>
          </div>
          <h1>{course.title}</h1>
          <p className="hero-desc">{course.description}</p>
          
          <div className="hero-meta">
            <span className="rating-badge">★ {calculateAverageRating()}</span>
            <span>({reviews.length} reviews)</span>
            <span>•</span>
            <span>{course.language}</span>
            <span>•</span>
            <span>{course.duration} total hours</span>
          </div>
        </div>
      </div>

      <div className="course-main-layout">
        
        {/* --- LEFT COLUMN: CONTENT --- */}
        <div className="course-content-col">
          
          {/* Curriculum Section */}
          <section className="detail-section">
            <h2>Course Curriculum</h2>
            <p className="section-subtitle">{videos.length} lectures</p>
            
            {videos.length === 0 ? (
              <div className="empty-curriculum">The instructor is still uploading videos for this course.</div>
            ) : (
              <div className="curriculum-list">
                {videos.map((video, index) => (
                  <div key={video._id} className="curriculum-item">
                    <div className="curriculum-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <div className="curriculum-info">
                      <span className="lecture-num">Lecture {index + 1}</span>
                      <h4 className="lecture-title">{video.title}</h4>
                    </div>
                    <span className="lecture-duration">{video.duration}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Reviews Section */}
          <section className="detail-section">
            <h2>Student Reviews</h2>
            
            {reviews.length === 0 ? (
              <div className="empty-reviews">No reviews yet. Be the first to enroll and review!</div>
            ) : (
              <div className="reviews-list">
                {reviews.map(review => (
                  <div key={review._id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          {/* Assuming populated user_id gives fullName */}
                          {review.user_id?.fullName?.charAt(0) || "S"}
                        </div>
                        <span className="reviewer-name">{review.user_id?.fullName || "Student"}</span>
                      </div>
                      <div className="review-stars">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p className="review-text">{review.review}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* --- RIGHT COLUMN: STICKY CHECKOUT CARD --- */}
        <div className="course-sidebar-col">
          <div className="checkout-card">
            
            <div className="checkout-thumbnail">
              <img src={course.thumbnail} alt={course.title} />
              <div className="play-overlay">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span>Preview Course</span>
              </div>
            </div>

            <div className="checkout-body">
              <h2 className="checkout-price">${course.price}</h2>
              
              {isUserEnrolled ? (
                <button 
                  className="action-btn resume-btn"
                  onClick={() => navigate(`/courses/${courseId}/${videos.length > 0 ? videos[0]._id : ''}`)}
                >
                  Resume Learning
                </button>
              ) : (
                <button 
                  className="action-btn enroll-btn" 
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                >
                  {isEnrolling ? 'Processing...' : 'Enroll Now'}
                </button>
              )}

              <p className="guarantee-text">30-Day Money-Back Guarantee</p>

              <div className="includes-list">
                <h3>This course includes:</h3>
                <ul>
                  <li>✅ {course.duration} hours on-demand video</li>
                  <li>✅ Access on mobile and TV</li>
                  <li>✅ Full lifetime access</li>
                  <li>✅ Certificate of completion</li>
                </ul>
              </div>
            </div>

          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default CourseDetail;