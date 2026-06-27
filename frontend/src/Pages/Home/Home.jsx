import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Home/Navbar/Navbar";
import SearchBar from "../../Components/Home/SearchBar/SearchBar";
import CategoryChips from "../../Components/Home/CategoryChips/CategoryChips";
import PopularCourses from "../../Components/Home/PopularCourses/PopularCourses";
import Footer from "../../Components/Home/Footer/Footer";

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/courses?q=${encodeURIComponent(query)}`);
    }
  };

  const handleCategorySelect = (categoryId) => {
    if (categoryId === "all") {
      navigate("/courses");
    } else {
      navigate(`/courses?category=${categoryId}`);
    }
  };

  return (
    <div>
      <Navbar />
      <SearchBar onSearch={handleSearch} />
      <CategoryChips onCategorySelect={handleCategorySelect} />
      <PopularCourses />
      <Footer />
    </div>
  );
};

export default Home;
