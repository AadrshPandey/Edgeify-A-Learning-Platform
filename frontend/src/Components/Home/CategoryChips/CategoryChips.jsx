import React, { useState, useEffect } from "react";
import "./CategoryChips.css";

const CategoryChips = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/v1/category/", {
          credentials: "include",
        });
        const data = await res.json();
        setCategories(data.data); // array of {_id, name, ...}
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
      onCategorySelect(categoryId); // sends _id up to parent, not name
    }
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="chips-wrapper">
      <div className="chips-container">
        {/* All chip — hardcoded, always first */}
        <button
          onClick={() => handleChipClick("all")}
          className={`chip-button ${activeCategory === "all" ? "active" : ""}`}
        >
          All
        </button>

        {/* Dynamic chips from API */}
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
