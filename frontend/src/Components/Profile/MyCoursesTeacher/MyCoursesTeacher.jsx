import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './MyCoursesTeacher.css';

const MyCoursesTeacher = () => {
  const { user } = useAuth();
  
  // Data States
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    level: 'Beginner', // Default value
    language: '',
    duration: '',
    category_id: '' // Only needed for creation
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  // --- INITIAL DATA FETCH ---
  const fetchMyCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/course/teacher/my-courses', { credentials: 'include' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch courses');
      setCourses(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/v1/category');
      const data = await response.json();
      if (response.ok) setCategories(data.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchMyCourses();
    fetchCategories();
  }, []);

  // --- MODAL & INPUT HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const openCreateModal = () => {
    setFormData({ title: '', description: '', price: '', level: 'Beginner', language: '', duration: '', category_id: '' });
    setThumbnailFile(null);
    setPreviewImage('');
    setIsCreateModalOpen(true);
  };

  const openEditModal = (course) => {
    setCurrentCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price,
      level: course.level,
      language: course.language,
      duration: course.duration,
      category_id: course.category_id // Note: Backend doesn't support changing this on update yet
    });
    setThumbnailFile(null);
    setPreviewImage(course.thumbnail || '');
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setCurrentCourse(null);
  };

  // --- API CALLS ---
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_id) return alert("Please select a category");
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('level', formData.level);
      submitData.append('language', formData.language);
      submitData.append('duration', formData.duration);
      if (thumbnailFile) submitData.append('thumbnail', thumbnailFile);

      // Pass category_id in the URL based on your router setup
      const response = await fetch(`/api/v1/course/create/${formData.category_id}`, {
        method: 'POST',
        body: submitData,
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      await fetchMyCourses();
      closeModal();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Update text details (JSON)
      const detailRes = await fetch(`/api/v1/course/update-details/${currentCourse._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          level: formData.level,
          language: formData.language,
          duration: Number(formData.duration)
        }),
        credentials: 'include'
      });
      if (!detailRes.ok) throw new Error("Failed to update details");

      // 2. Update thumbnail if new one selected (FormData)
      if (thumbnailFile) {
        const imageForm = new FormData();
        imageForm.append('thumbnail', thumbnailFile);
        
        const imageRes = await fetch(`/api/v1/course/update-thumbnail/${currentCourse._id}`, {
          method: 'PATCH',
          body: imageForm,
          credentials: 'include'
        });
        if (!imageRes.ok) throw new Error("Failed to update thumbnail");
      }

      await fetchMyCourses();
      closeModal();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course permanently? This action cannot be undone.")) return;

    try {
      const response = await fetch(`/api/v1/course/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete course');
      setCourses(prev => prev.filter(course => course._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };


  // --- RENDER ---
  if (isLoading) return <div className="loading-state"><div className="spinner"></div><p>Loading courses...</p></div>;
  if (error) return <div className="error-state"><p>{error}</p><button onClick={fetchMyCourses}>Retry</button></div>;

  return (
    <div className="my-courses-container">
      
      <div className="courses-header">
        <div>
          <h2>My Courses</h2>
          <p>Manage, edit, and create your educational content.</p>
        </div>
        <button className="create-btn" onClick={openCreateModal}>
          + Create Course
        </button>
      </div>

      {/* --- COURSES GRID --- */}
      {courses.length === 0 ? (
        <div className="empty-state">
          <p>You haven't created any courses yet.</p>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course._id} className="course-card">
              <div className="course-img-container">
                <img src={course.thumbnail || "https://via.placeholder.com/300x150?text=No+Thumbnail"} alt={course.title} />
                <span className="course-level-badge">{course.level}</span>
              </div>
              <div className="course-content">
                <div className="course-meta">
                  <span>${course.price}</span>
                  <span>•</span>
                  <span>{course.duration} hrs</span>
                </div>
                <h3>{course.title}</h3>
                <p className="course-desc">{course.description}</p>
                
                <div className="course-actions">
                  <button className="manage-videos-btn" onClick={() => alert("Navigate to video manager for course: " + course._id)}>
                    Videos
                  </button>
                  <div className="action-group">
                    <button className="edit-btn" onClick={() => openEditModal(course)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(course._id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- CREATE / EDIT MODAL --- */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="modal-overlay">
          <div className="modal-content course-modal">
            <div className="modal-header">
              <h3>{isCreateModalOpen ? 'Create New Course' : 'Edit Course'}</h3>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            
            <form onSubmit={isCreateModalOpen ? handleCreateSubmit : handleEditSubmit} className="modal-form">
              
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Course Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                {/* Only allow category selection on create (based on your backend logic) */}
                {isCreateModalOpen && (
                  <div className="form-group flex-1">
                    <label>Category</label>
                    <select name="category_id" value={formData.category_id} onChange={handleInputChange} required>
                      <option value="" disabled>Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.category_name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3"></textarea>
              </div>

              <div className="form-row">
                <div className="form-group info">
                  <label>Price ($)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" />
                </div>
                <div className="form-group info">
                  <label>Duration (Hours)</label>
                  <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} required min="0" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Difficulty Level</label>
                  <select name="level" value={formData.level} onChange={handleInputChange} required>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Language</label>
                  <input type="text" name="language" value={formData.language} onChange={handleInputChange} required placeholder="e.g. English, Spanish" />
                </div>
              </div>

              <div className="form-group">
                <label>Course Thumbnail {isCreateModalOpen && '(Required)'}</label>
                <div className="thumbnail-upload-box">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="preview-img" />
                  ) : (
                    <div className="placeholder-box">Select an Image</div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} required={isCreateModalOpen} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Course'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyCoursesTeacher;