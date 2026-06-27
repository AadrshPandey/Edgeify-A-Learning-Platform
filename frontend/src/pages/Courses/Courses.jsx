import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../../Components/Home/Navbar/Navbar';
import Footer from '../../Components/Home/Footer/Footer';
import './Courses.css';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);

  //Params
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All';
  
  // Filters
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Status
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  //Initial Params filter
  useEffect(() => {
  if (initialQuery) {
    setSearchQuery(initialQuery);
    setIsSearching(true);
  }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/category`);
        const data = await response.json();
        if (response.ok) setCategories(data.data);
      } catch (err) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        let url = `${BASE_URL}/api/v1/course/popular`;

        if (searchQuery && isSearching) {
          url = `${BASE_URL}/api/v1/course/search?query=${encodeURIComponent(searchQuery)}`;
        } else if (activeCategory !== 'All') {
          url = `${BASE_URL}/api/v1/course/category/${activeCategory}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Failed to fetch courses');
        
        setCourses(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
        setIsSearching(false); 
      }
    };

    fetchCourses();
  }, [activeCategory, isSearching]); 

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveCategory('All'); 
    setIsSearching(true);

    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery }); 
    } else {
      setSearchParams({}); 
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSearchQuery(''); 
    setActiveCategory(categoryId);

    if (categoryId === 'All') {
      setSearchParams({}); 
    } else {
      setSearchParams({ category: categoryId }); 
    }
  };

  return (
    <div className="courses-page-wrapper">
      <Navbar />
      
      <main className="courses-main-container">
        
        <section className="courses-hero">
          <h1>Explore Our Catalog</h1>
          <p>Find the perfect course to advance your skills and career.</p>
          
          <form className="courses-search-bar" onSubmit={handleSearchSubmit}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search for web development, python, design..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </section>

        <section className="category-filters">
          <button 
            className={`category-pill ${activeCategory === 'All' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('All')}
          >
            {searchQuery ? 'Search Results' : 'Popular Courses'}
          </button>
          
          {categories.map(cat => (
            <button 
              key={cat._id}
              className={`category-pill ${activeCategory === cat._id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat._id)}
            >
              {cat.category_name}
            </button>
          ))}
        </section>

        {isLoading ? (
          <div className="courses-loading"><div className="spinner"></div></div>
        ) : error ? (
          <div className="courses-error"><p>{error}</p></div>
        ) : courses.length === 0 ? (
          <div className="courses-empty">
            <h3>No courses found</h3>
            <p>Try adjusting your search or selecting a different category.</p>
          </div>
        ) : (
          <div className="explore-grid">
            {courses.map(course => (
              <Link to={`/courses/${course._id}`} key={course._id} className="explore-card">
                <div className="explore-img">
                  <img src={course.thumbnail || "https://via.placeholder.com/300x170?text=Course"} alt={course.title} />
                  <span className="explore-level">{course.level}</span>
                </div>
                <div className="explore-content">
                  <h3 className="explore-title">{course.title}</h3>
                  <p className="explore-teacher">
                    {course.teacher_id?.fullName || "Instructor"}
                  </p>
                  
                  <div className="explore-footer">
                    <span className="explore-duration">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {course.duration} hrs
                    </span>
                    <span className="explore-price">₹{course.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </main>
      
      <Footer />
    </div>
  );
};

export default Courses;