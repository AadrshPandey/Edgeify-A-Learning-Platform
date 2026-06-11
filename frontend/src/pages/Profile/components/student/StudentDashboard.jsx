import React from "react";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  return (
    <div className="studentDashboard">
      <div className="statsGrid">
        <div className="statCard">
          <h2>12</h2>
          <p>Enrolled Courses</p>
        </div>

        <div className="statCard">
          <h2>4</h2>
          <p>Completed Courses</p>
        </div>

        <div className="statCard">
          <h2>3</h2>
          <p>Certificates</p>
        </div>

        <div className="statCard">
          <h2>87</h2>
          <p>Learning Hours</p>
        </div>
      </div>

      <div className="dashboardSection">
        <h2>Continue Learning</h2>

        <div className="courseList">
          <div className="courseCard">
            <h3>Complete React Course</h3>
            <p>Progress: 68%</p>

            <div className="progressBar">
              <div className="progressFill" style={{ width: "68%" }}></div>
            </div>
          </div>

          <div className="courseCard">
            <h3>Node.js Backend Development</h3>
            <p>Progress: 42%</p>

            <div className="progressBar">
              <div className="progressFill" style={{ width: "42%" }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboardSection">
        <h2>Recent Activity</h2>

        <div className="activityList">
          <div className="activityCard">Completed "React Hooks" lesson</div>

          <div className="activityCard">
            Enrolled in "Node.js Backend Development"
          </div>

          <div className="activityCard">
            Earned "JavaScript Basics" certificate
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
