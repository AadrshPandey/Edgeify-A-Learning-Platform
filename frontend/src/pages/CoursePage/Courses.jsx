import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Courses.css";
import Footer from "../../components/Footer/Footer";
import SearchSection from "../../components/searchSection/SearchSection";
import FilterSection from "../../components/filterSection/FilterSection";
import Coursescard from "../../components/CoursesCards/Coursescard";

const Courses = () => {
const allCourses = [
  {
    title: "Complete JS Course in Hindi | Code Help",
    thumbnail: "https://i.ytimg.com/vi/rfObCuGLSek/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCbupwFiZw0mzq90-XOrbvoEcyZHg",
    link: "https://youtu.be/rfObCuGLSek?si=QP23zW7va5JO1s1q",
    duration: "12:23:39",
    category: "web",
    level:"easy"
  },
  {
    title: "Complete React JS Course in Hindi | CodeWithHarry",
    thumbnail: "https://i.ytimg.com/vi/29qFl5AOU9M/hq720.jpg",
    link: "https://youtu.be/29qFl5AOU9M",
    duration: "14:00:00",
    category: "web",
    level:"easy"
  },
  {
    title: "Complete Python Full Course in Hindi | CodeWithHarry",
    thumbnail: "https://i.ytimg.com/vi/vxHUFFiT0OI/hq720.jpg",
    link: "https://youtu.be/vxHUFFiT0OI",
    duration: "12:24:00",
    category: "language",
    level:"easy"
  },
  {
    title: "Complete C++ Course in Hindi | CodeWithHarry",
    thumbnail: "https://i.ytimg.com/vi/yGB9jhsEsr8/hq720.jpg",
    link: "https://youtu.be/yGB9jhsEsr8",
    duration: "15:30:00",
    category: "language",
    level:"hard"
  },
  {
    title: "Complete DSA Course in Hindi | Love Babbar",
    thumbnail: "https://i.ytimg.com/vi/9kQ1JUDleWg/hq720.jpg",
    link: "https://youtu.be/9kQ1JUDleWg",
    duration: "18:00:00",
    category: "DSA",
    level:"easy"
  },
  {
    title: "NodeJS Complete Course in Hindi | Sunfire Sensei",
    thumbnail: "https://i.ytimg.com/vi/VrQgmNY96wo/hq720.jpg",
    link: "https://youtu.be/VrQgmNY96wo",
    duration: "12:00:00",
    category: "web",
    level:"medium"
  },
  {
    title: "NodeJS Complete Course in Hindi | Notes (Certification)",
    thumbnail: "https://i.ytimg.com/vi/AZzV3wZCvI4/hq720.jpg",
    link: "https://youtu.be/AZzV3wZCvI4",
    duration: "11:00:00",
    category: "web",
    level:"easy"
  },
  {
    title: "Nodejs Full Course in Hindi | One Video",
    thumbnail: "https://i.ytimg.com/vi/0mH6bVpxLAA/hq720.jpg",
    link: "https://youtu.be/0mH6bVpxLAA",
    duration: "10:00:00",
    category: "web",
    level:"hard"
  },
  {
    title: "Complete Express JS Course in Hindi | Crash Tutorial",
    thumbnail: "https://i.ytimg.com/vi/H9M02of22z4/hq720.jpg",
    link: "https://youtu.be/H9M02of22z4",
    duration: "02:00:00",
    category: "web",
    level:"easy"
  },
  {
    title: "SQL Full Course in Hindi | Beginner to Advanced",
    thumbnail: "https://i.ytimg.com/vi/7azCOKryADA/hq720.jpg",
    link: "https://youtu.be/7azCOKryADA",
    duration: "11:00:00",
    category: "database",
    level:"easy"
  },
  {
    title: "SQL Tutorial for Beginners in Hindi | On9eSN3F8w0",
    thumbnail: "https://i.ytimg.com/vi/On9eSN3F8w0/hq720.jpg",
    link: "https://youtu.be/On9eSN3F8w0",
    duration: "03:00:00",
    category: "database",
    level:"medium"
  },
  {
    title: "Complete HTML Course | Love Babbar",
    thumbnail: "https://i.ytimg.com/vi/k7ELO356Npo/hq720.jpg",
    link: "https://youtu.be/k7ELO356Npo",
    duration: "05:48:08",
    category: "web",
    level:"easy"
  },
  {
    title: "Complete HTML Course | Apna College",
    thumbnail: "https://i.ytimg.com/vi/HcOc7P5BMi4/hq720.jpg",
    link: "https://youtu.be/HcOc7P5BMi4",
    duration: "02:06:00",
    category: "web",
    level:"easy"
  },
  {
    title: "Complete CSS Course | Apni Kaksha",
    thumbnail: "https://i.ytimg.com/vi/ESnrn1kAD4E/hq720.jpg",
    link: "https://youtu.be/ESnrn1kAD4E",
    duration: "07:18:24",
    category: "web",
    level:"hard"
  },
  {
    title: "Complete CSS Course | Love Babbar",
    thumbnail: "https://i.ytimg.com/vi/dSJM4Gyh8jE/hq720.jpg",
    link: "https://youtu.be/dSJM4Gyh8jE",
    duration: "10:49:44",
    category: "web",
    level:"medium"
  }
];

const [category, setCategory] = useState("");
const [level, setLevel] = useState("");

const filteredCourses = allCourses.filter((course) => {
  const categoryMatch = category === "" || course.category === category

  const levelMatch = level === "" || course.level === level

  return categoryMatch && levelMatch;
});

  return (
    <div className="courses">
      <div className="content">
        <div className="header">
          <div className="navbar">
            <Navbar />
          </div>

          <div className="searchbar">
            <SearchSection />
            <FilterSection 
            category = {category}
            setCategory = {setCategory}
            level = {level}
            setLevel = {setLevel}
            />
          </div>

          <div className="cards">

            {filteredCourses.length === 0 ? <h1 className="font-bold flex text-2xl items-center">No Course Found...</h1> : (filteredCourses.map((course, index)=>(
              <Coursescard
              key= {index}
              title= {course.title}
              thumbnail= {course.thumbnail}
              link= {course.link}
              duration= {course.duration}
              category= {course.category}
              />
            )))}
          </div>
        </div>

        <div className="footer">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Courses;
