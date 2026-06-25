import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './MyCategories.css';

const MyCategories = () => {
  const { user } = useAuth();
  
  // State for data and UI flow
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Form States
  const [currentCategory, setCurrentCategory] = useState(null); // Used for editing
  const [formData, setFormData] = useState({ category_name: '', description: '' });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FETCH CATEGORIES ---
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/category');
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to fetch categories');
      
      // Filter categories so the teacher only sees the ones they created
      const myCategories = data.data.filter(cat => cat.user_id === user._id);
      setCategories(myCategories);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- HANDLERS ---
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
    setFormData({ category_name: '', description: '' });
    setThumbnailFile(null);
    setPreviewImage('');
    setIsCreateModalOpen(true);
  };

  const openEditModal = (category) => {
    setCurrentCategory(category);
    setFormData({ category_name: category.category_name, description: category.description });
    setThumbnailFile(null);
    setPreviewImage(category.thumbnail || '');
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setCurrentCategory(null);
  };

  // --- CREATE SUBMIT ---
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('category_name', formData.category_name);
      submitData.append('description', formData.description);
      if (thumbnailFile) submitData.append('thumbnail', thumbnailFile);

      const response = await fetch('/api/v1/category/create', {
        method: 'POST',
        body: submitData,
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Refresh the list and close modal
      await fetchCategories();
      closeModal();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- UPDATE SUBMIT (Handles Text and Image separately as per backend) ---
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Update text details
      const detailRes = await fetch(`/api/v1/category/update-details/${currentCategory._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_name: formData.category_name,
          description: formData.description
        }),
        credentials: 'include'
      });
      if (!detailRes.ok) throw new Error("Failed to update details");

      // 2. Update thumbnail if a new file was selected
      if (thumbnailFile) {
        const imageForm = new FormData();
        imageForm.append('thumbnail', thumbnailFile);
        
        const imageRes = await fetch(`/api/v1/category/update-thumbnail/${currentCategory._id}`, {
          method: 'PATCH',
          body: imageForm,
          credentials: 'include'
        });
        if (!imageRes.ok) throw new Error("Failed to update thumbnail");
      }

      await fetchCategories();
      closeModal();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DELETE ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category? This cannot be undone.")) return;

    try {
      const response = await fetch(`/api/v1/category/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete');
      }

      // Remove from UI without fetching again
      setCategories(prev => prev.filter(cat => cat._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };


  // --- RENDER ---
  if (isLoading) return <div className="loading-state"><div className="spinner"></div><p>Loading categories...</p></div>;
  if (error) return <div className="error-state"><p>{error}</p><button onClick={fetchCategories}>Retry</button></div>;

  return (
    <div className="categories-container">
      
      <div className="categories-header">
        <div>
          <h2>Manage Categories</h2>
          <p>Organize your courses into structured categories.</p>
        </div>
        <button className="create-btn" onClick={openCreateModal}>
          + Create Category
        </button>
      </div>

      {/* --- CATEGORY GRID --- */}
      {categories.length === 0 ? (
        <div className="empty-state">
          <p>You haven't created any categories yet.</p>
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category._id} className="category-card">
              <div className="category-img-container">
                <img src={category.thumbnail || "https://via.placeholder.com/300x150?text=No+Thumbnail"} alt={category.category_name} />
              </div>
              <div className="category-content">
                <h3>{category.category_name}</h3>
                <p>{category.description}</p>
                <div className="category-actions">
                  <button className="edit-btn" onClick={() => openEditModal(category)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(category._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- SHARED MODAL COMPONENT --- */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{isCreateModalOpen ? 'Create New Category' : 'Edit Category'}</h3>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            
            <form onSubmit={isCreateModalOpen ? handleCreateSubmit : handleEditSubmit} className="modal-form">
              
              <div className="form-group">
                <label>Category Name</label>
                <input 
                  type="text" 
                  name="category_name" 
                  value={formData.category_name} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g., Web Development"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  required 
                  rows="3"
                  placeholder="What is this category about?"
                ></textarea>
              </div>

              <div className="form-group">
                <label>Thumbnail Image {isCreateModalOpen && '(Required)'}</label>
                <div className="thumbnail-upload-box">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="preview-img" />
                  ) : (
                    <div className="placeholder-box">Select an Image</div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    required={isCreateModalOpen} // Only strictly required on create
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyCategories;