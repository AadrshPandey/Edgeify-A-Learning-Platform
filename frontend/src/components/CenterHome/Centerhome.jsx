import React from "react";
import './Centerhome.css';
import searchIcon from '../../assets/searchicon.png';
import nextIcon from '../../assets/next.png';

const Centerhome = () => {
  return (
    <div className="center">
      <div className="quote">
        <h1>EXPLORE, UNDERSTAND, APPLY, IMPROVE</h1>
        <h5>Master skills with consistent effort</h5>
      </div>
      <div className="searchBox">
        <img src={searchIcon} alt="" className="searchicons" />
        <input type="text" placeholder="Search for a course..." />
        <img src={nextIcon} alt="next" className="nexticons" />
      </div>
    </div>
  );
};

export default Centerhome;
