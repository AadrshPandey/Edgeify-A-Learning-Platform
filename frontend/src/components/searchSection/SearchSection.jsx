import React, { useState } from "react";
import "./SearchSection.css";
import searchIcon from "../../assets/searchIcon.png";
import nextIcon from "../../assets/next.png";

const SearchSection = () => {
  return (
    <div>
      <div className="searchBox">
        <img src={searchIcon} alt="" className="searchicons" />
        <input type="text" placeholder="Search for a course..." />
        <img src={nextIcon} alt="next" className="nexticons" />
      </div>
    </div>
  );
};

export default SearchSection;
