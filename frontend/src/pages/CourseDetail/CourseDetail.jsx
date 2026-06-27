import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../Components/Home/Navbar/Navbar';
import Footer from '../../Components/Home/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import './CourseDetail.css';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

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

  // --- Review Form States ---
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true);
      try {
        const [courseRes, videoRes, reviewRes] = await Promise.all([
          fetch(`${BASE_URL}/api/v1/course/${courseId}`),
          fetch(`${BASE_URL}/api/v1/video/course/${courseId}`),
          fetch(`${BASE_URL}/api/v1/review/allReviews/${courseId}`)
        ]);

        const courseData = await courseRes.json();
        const videoData = await videoRes.json();
        const reviewData = await reviewRes.json();

        if (!courseRes.ok) throw new Error(courseData.message || 'Course not found');

        setCourse(courseData.data);
        setVideos(videoData.data || []);
        
        const fetchedReviews = reviewData.data || [];
        setReviews(fetchedReviews);

        if (user) {
          const alreadyReviewed = fetchedReviews.some(r => 
            r.user_id?._id === user._id || r.user_id === user._id
          );
          setHasReviewed(alreadyReviewed);

          const enrollRes = await fetch(`${BASE_URL}/api/v1/enrollment/is-enrolled/${courseId}`, {
            credentials: 'include'
          });
          
          if (enrollRes.ok) {
            setIsUserEnrolled(true);
          } else {
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

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    if (user.role === 'teacher' && course?.teacher_id === user._id) {
      alert("You are the creator of this course!");
      return;
    }

    setIsEnrolling(true);
    try {
      const response = await fetch(`${BASE_URL}/api/v1/enrollment/enroll/${courseId}`, {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to enroll');
      
      setIsUserEnrolled(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsEnrolling(false);
    }
  };
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return setReviewError("Review text cannot be empty");

    setIsSubmittingReview(true);
    setReviewError('');

    try {
      const response = await fetch(`${BASE_URL}/api/v1/review/create/${courseId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review: reviewText }),
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to submit review');

      const newReview = {
        _id: data.data?._id || Date.now(),
        user_id: { _id: user._id, fullName: user.fullName || "You" },
        rating,
        review: reviewText
      };
      
      setReviews([newReview, ...reviews]);
      setHasReviewed(true);
      setReviewText('');

    } catch (err) {
      setReviewError(err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  if (isLoading) return <div className="course-detail-loading"><div className="spinner"></div></div>;
  if (error) return <div className="course-detail-error"><h2>Oops!</h2><p>{error}</p><Link to="/courses">Go back to courses</Link></div>;
  if (!course) return null;

  return (
    <div className="course-detail-wrapper">
      <Navbar />

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
        
        <div className="course-content-col">
          
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

          <section className="detail-section">
            <h2>Student Reviews</h2>

            {isUserEnrolled && !hasReviewed && (
              <div className="add-review-box" style={{ background: '#111', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3>Leave a Review</h3>
                {reviewError && <p style={{ color: '#ff4444' }}>{reviewError}</p>}
                
                <form onSubmit={handleReviewSubmit}>
                  <div className="star-selector" style={{ marginBottom: '10px', fontSize: '24px', cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        onClick={() => setRating(star)}
                        style={{ color: star <= rating ? '#FFD700' : '#444', marginRight: '5px' }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  
                  <textarea 
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Tell us what you thought about this course..."
                    required
                    style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '4px', background: '#222', color: '#fff', border: '1px solid #333', marginBottom: '10px' }}
                  />
                  
                  <button 
                    type="submit" 
                    disabled={isSubmittingReview}
                    className="action-btn"
                    style={{ padding: '8px 16px', background: '#0D51FB', color: 'white', border: 'none', borderRadius: '4px' }}
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}

            {isUserEnrolled && hasReviewed && (
              <p style={{ color: '#888', fontStyle: 'italic', marginBottom: '20px' }}>Thanks for reviewing this course!</p>
            )}

            {reviews.length === 0 ? (
              <div className="empty-reviews">No reviews yet. Be the first to enroll and review!</div>
            ) : (
              <div className="reviews-list">
                {reviews.map(review => (
                  <div key={review._id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          {review.user_id?.fullName?.charAt(0) || "S"}
                        </div>
                        <span className="reviewer-name">{review.user_id?.fullName || "Student"}</span>
                      </div>
                      <div className="review-stars">
                        <span style={{color: '#FFD700'}}>{'★'.repeat(review.rating)}</span>
                        <span style={{color: '#444'}}>{'★'.repeat(5 - review.rating)}</span>
                      </div>
                    </div>
                    <p className="review-text">{review.review}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

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
              <h2 className="checkout-price">₹{course.price}</h2>
              
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