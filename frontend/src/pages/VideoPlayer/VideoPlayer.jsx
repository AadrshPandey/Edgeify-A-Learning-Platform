import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../Components/Home/Navbar/Navbar';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const { courseId, videoId } = useParams();
  const navigate = useNavigate();

  // States
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [completedVideoIds, setCompletedVideoIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Find the currently active video object based on the URL parameter
  const currentVideo = videos.find(v => v._id === videoId) || videos[0];

  useEffect(() => {
    const fetchLearningData = async () => {
      setIsLoading(true);
      try {
        // Fetch course details, all videos, and the user's completed videos concurrently
        const [courseRes, videosRes, progressRes] = await Promise.all([
          fetch(`/api/v1/course/${courseId}`),
          fetch(`/api/v1/video/course/${courseId}`),
          fetch(`/api/v1/progress/completed-videos`, { credentials: 'include' })
        ]);

        const courseData = await courseRes.json();
        const videosData = await videosRes.json();
        const progressData = await progressRes.json();

        if (!videosRes.ok) throw new Error(videosData.message || "Failed to load curriculum");

        setCourse(courseData.data);
        setVideos(videosData.data || []);

        // Extract just the IDs of completed videos for easy checking
        if (progressRes.ok && progressData.data) {
          const completedIds = progressData.data.map(p => p.video_id?._id || p.video_id);
          setCompletedVideoIds(completedIds);
        }

        // If there's no videoId in the URL but we have videos, redirect to the first video
        if (!videoId && videosData.data?.length > 0) {
          navigate(`/courses/${courseId}/${videosData.data[0]._id}`, { replace: true });
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningData();
  }, [courseId, videoId, navigate]);

  // --- PROGRESS TOGGLE HANDLER ---
  const handleProgressToggle = async (targetVideoId, e) => {
    // Prevent the click from also navigating to the video if they just click the checkbox
    e.stopPropagation(); 
    
    const isCurrentlyCompleted = completedVideoIds.includes(targetVideoId);
    const endpoint = isCurrentlyCompleted 
      ? `/api/v1/progress/incomplete/${targetVideoId}` 
      : `/api/v1/progress/complete/${targetVideoId}`;

    try {
      // Optimistically update the UI so it feels instantaneous
      if (isCurrentlyCompleted) {
        setCompletedVideoIds(prev => prev.filter(id => id !== targetVideoId));
      } else {
        setCompletedVideoIds(prev => [...prev, targetVideoId]);
      }

      const response = await fetch(endpoint, {
        method: 'PATCH',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("Failed to update progress");
      }
    } catch (err) {
      // Revert UI if the API call fails
      alert(err.message);
      if (isCurrentlyCompleted) {
        setCompletedVideoIds(prev => [...prev, targetVideoId]);
      } else {
        setCompletedVideoIds(prev => prev.filter(id => id !== targetVideoId));
      }
    }
  };

  if (isLoading) return <div className="vp-loading"><div className="spinner"></div></div>;
  if (error) return <div className="vp-error"><p>{error}</p><Link to="/courses">Back to Courses</Link></div>;
  if (videos.length === 0) return <div className="vp-error"><p>No videos available for this course yet.</p></div>;

  return (
    <div className="vp-page-wrapper">
      <Navbar />

      <div className="vp-layout">
        
        {/* --- LEFT SIDE: VIDEO PLAYER --- */}
        <div className="vp-main-content">
          <div className="vp-video-container">
            {currentVideo ? (
              <video 
                key={currentVideo.video_url} // Forces react to reload player on src change
                controls 
                autoPlay 
                controlsList="nodownload"
                className="vp-video-element"
              >
                <source src={currentVideo.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="vp-placeholder">Select a video to start learning</div>
            )}
          </div>

          <div className="vp-video-details">
            <h1 className="vp-video-title">{currentVideo?.title}</h1>
            <p className="vp-course-title">Course: {course?.title}</p>
            
            <div className="vp-description-box">
              <h3>Description</h3>
              <p>{currentVideo?.description}</p>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: CURRICULUM SIDEBAR --- */}
        <div className="vp-sidebar">
          <div className="vp-sidebar-header">
            <h2>Course Content</h2>
            <div className="vp-progress-text">
              {completedVideoIds.length} / {videos.length} completed
            </div>
          </div>

          <div className="vp-playlist">
            {videos.map((video, index) => {
              const isActive = video._id === currentVideo?._id;
              const isCompleted = completedVideoIds.includes(video._id);

              return (
                <div 
                  key={video._id} 
                  className={`vp-playlist-item ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(`/courses/${courseId}/${video._id}`)}
                >
                  <div className="vp-item-left">
                    <button 
                      className={`vp-checkbox ${isCompleted ? 'checked' : ''}`}
                      onClick={(e) => handleProgressToggle(video._id, e)}
                      title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                    >
                      {isCompleted && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <div className="vp-item-info">
                      <span className="vp-item-num">Lesson {index + 1}</span>
                      <h4 className="vp-item-title">{video.title}</h4>
                    </div>
                  </div>
                  <span className="vp-item-duration">{video.duration}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoPlayer;