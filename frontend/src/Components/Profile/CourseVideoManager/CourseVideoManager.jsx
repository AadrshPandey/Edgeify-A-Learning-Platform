import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CourseVideoManager.css';

const CourseVideoManager = () => {
  const { course_id } = useParams(); 
  const navigate = useNavigate(); // <-- Initialized here
  
  // States
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Form States
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '' 
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  // --- FETCH EXISTING VIDEOS ---
  const fetchVideos = async () => {
    try {
      const response = await fetch(`/api/v1/video/course/${course_id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setVideos(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [course_id]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- UPLOAD VIDEO ---
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!thumbnailFile || !videoFile) return alert("Please select both a thumbnail and a video file.");

    setIsUploading(true);
    setUploadProgress(0);

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('duration', formData.duration);
    submitData.append('thumbnail', thumbnailFile); 
    submitData.append('video_url', videoFile);     

    try {
      const response = await axios.post(
        `/api/v1/video/upload/${course_id}`, 
        submitData,
        {
          withCredentials: true, 
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      );

      setVideos([...videos, response.data.data]); 
      
      setFormData({ title: '', description: '', duration: '' });
      setThumbnailFile(null);
      setVideoFile(null);
      alert("Video uploaded successfully!");

    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      alert(`Upload failed: ${errorMsg}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // --- DELETE VIDEO ---
  const handleDelete = async (videoId) => {
    if (!window.confirm("Delete this video permanently?")) return;

    try {
      const response = await fetch(`/api/v1/video/delete/${videoId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error("Failed to delete");
      setVideos(videos.filter(v => v._id !== videoId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading) return <div className="video-manager-loading"><div className="spinner"></div></div>;

  return (
    <div className="video-manager-container">
      
      {/* HEADER */}
      <div className="manager-header">
        <div>
          <Link to="/profile" className="back-link">← Back to Courses</Link>
          <h2>Course Curriculum Manager</h2>
          <p>Upload and organize videos for this course.</p>
        </div>
      </div>

      <div className="manager-layout">
        
        {/* LEFT COL: VIDEO LIST */}
        <div className="video-list-section">
          <h3>Uploaded Videos ({videos.length})</h3>
          
          {videos.length === 0 ? (
            <div className="empty-videos">No videos uploaded yet.</div>
          ) : (
            <div className="videos-grid">
              {videos.map((video, index) => (
                <div 
                  key={video._id} 
                  className="video-card"
                  onClick={() => navigate(`/courses/${course_id}/${video._id}`)} // <-- Navigate to player
                  style={{ cursor: 'pointer' }}
                >
                  <div className="video-thumb">
                    <img src={video.thumbnail} alt={video.title} />
                    <span className="duration-badge">{video.duration}</span>
                  </div>
                  <div className="video-info">
                    <h4>{index + 1}. {video.title}</h4>
                    <button 
                      className="delete-video-btn" 
                      onClick={(e) => {
                        e.stopPropagation(); // <-- Prevents the card click when deleting
                        handleDelete(video._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COL: UPLOAD FORM */}
        <div className="upload-section">
          <h3>Upload New Video</h3>
          
          <form onSubmit={handleUpload} className="upload-form">
            <div className="form-group">
              <label>Video Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required disabled={isUploading}/>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3" disabled={isUploading}></textarea>
            </div>

            <div className="form-group">
              <label>Duration (e.g. "12:30")</label>
              <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} required disabled={isUploading}/>
            </div>

            <div className="file-inputs">
              <div className="form-group">
                <label>Thumbnail Image</label>
                <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files[0])} required disabled={isUploading}/>
              </div>

              <div className="form-group">
                <label>Video File (.mp4)</label>
                <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} required disabled={isUploading}/>
              </div>
            </div>

            {/* PROGRESS BAR UI */}
            {isUploading && (
              <div className="upload-progress-container">
                <div className="progress-text">
                  <span>Uploading to Cloudinary...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                {uploadProgress === 100 && <p className="processing-text">Processing video, please wait...</p>}
              </div>
            )}

            <button type="submit" className="upload-submit-btn" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CourseVideoManager;