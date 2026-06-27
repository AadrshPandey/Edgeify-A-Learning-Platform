import React, { useState, useEffect } from "react";
import "./CategoryChips.css";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const CategoryChips = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/category/`, {
          credentials: "include",
        });
        const data = await res.json();
        setCategories(data.data); 
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChipClick = (categoryId) => {
    setActiveCategory(categoryId);
    if (onCategorySelect) {
      onCategorySelect(categoryId); 
    }
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="chips-wrapper">
      <div className="chips-container">
        <button
          onClick={() => handleChipClick("all")}
          className={`chip-button ${activeCategory === "all" ? "active" : ""}`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleChipClick(cat._id)}
            className={`chip-button ${activeCategory === cat._id ? "active" : ""}`}
          >
            {cat.category_name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryChips;
