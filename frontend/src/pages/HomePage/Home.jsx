import React, { use, useEffect, useRef } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Centerhome from "../../components/CenterHome/Centerhome";
import Usercards from "../../components/UserCards/Usercards";
import Courseleftsection from "../../components/CourseleftSection/Courseleftsection";
import Courserightsection from "../../components/CourserightSection/Courserightsection";
import Footer from "../../components/Footer/Footer";
import "./Home.css";

const students = [
  {
    name: "Aadrsh Pandey",
    course: "Full Stack Web Dev",
  },
  {
    name: "Elon Musk",
    course: "Android Devlopment",
  },
  {
    name: "Steve Jobs",
    course: "Video Editing",
  },
  {
    name: "XI jingping",
    course: "Free Fire",
  },
  {
    name: "Vladimir Putin",
    course: "Brahmos",
  },
];

const courses = [
  {
    thumbnail: "https://i.ytimg.com/vi/k7ELO356Npo/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLC8CJ82Tzz46ghY1llSUo6Pl2tp5A",
    title: "Complete HTML Course",
    description: "This course is for the beginners who want to learn complete HTML in one shot.",
    duration: "5:48:04",
    link: "https://youtu.be/k7ELO356Npo?si=ZYjMWY9NWv-TRRWU",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/dSJM4Gyh8jE/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCktKX0RWLj5tesRTJrRZ8EZTcTyw",
    title: "Complete CSS Course",
    description: "This course is for the beginners who want to learn complete CSS in one shot.",
    duration: "10:49:44",
    link: "https://youtu.be/dSJM4Gyh8jE?si=ZCE0UwqwwoUa5ANz",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/rfObCuGLSek/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCbupwFiZw0mzq90-XOrbvoEcyZHg",
    title: "Complete JS Course",
    description: "This course is for the beginners who want to learn complete JS in one shot.",
    duration: "12:23:39",
    link: "https://youtu.be/rfObCuGLSek?si=ZlCbN3MowHsCnuM0",
  }
];

const Home = () => {
  const scrollref = useRef(0);

  useEffect(() => {
    const scrollContainer = scrollref.current;
    let scrollAmount = 0;

    const scrollInterval = setInterval(() => {
      if (!scrollContainer) return;

      scrollContainer.scrollLeft += 1;
      scrollAmount += 1;

      if (
        scrollContainer.scrollLeft + scrollContainer.offsetWidth >=
        scrollContainer.scrollWidth
      ) {
        scrollContainer.scrollLeft = 0;
      }
    }, 20);

    return () => {
      clearInterval(scrollInterval);
    };
  }, []);

  return (
    <div className="home">
      <div className="vdoBG">
        <div className="navbar">
          <Navbar />
        </div>

        <div className="centerhome">
          <Centerhome/>
        </div>

        <div className="usercards" ref={scrollref}>
          {students.map((student, index) => (
            <Usercards
              key={index}
              name={student.name}
              course={student.course}
            />
          ))}
        </div>
      </div>

      <div className="plainBG">
        <div className="courseleft">
          {courses.map((course, index) => (
            (index%2)?
            (
              <Courserightsection
            key={index}
            thumbnail={course.thumbnail}
            title={course.title}
            description={course.description}
            duration={course.duration}
            link={course.link}
            />
            ) :
            (
              <Courseleftsection
            key={index}
            thumbnail={course.thumbnail}
            title={course.title}
            description={course.description}
            duration={course.duration}
            link={course.link}
            />
            )
          ))}
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
