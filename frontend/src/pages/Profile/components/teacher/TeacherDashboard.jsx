import React from "react";
import "./TeacherDashboard.css";

const TeacherDashboard = () => {
  return (
    <div className="teacherDashboard">

      <div className="statsGrid">

        <div className="statCard">
          <h2>8</h2>
          <p>Courses Published</p>
        </div>

        <div className="statCard">
          <h2>427</h2>
          <p>Total Students</p>
        </div>

        <div className="statCard">
          <h2>92%</h2>
          <p>Average Completion Rate</p>
        </div>

        <div className="statCard">
          <h2>156</h2>
          <p>Certificates Issued</p>
        </div>

      </div>

      <div className="dashboardSection">

        <div className="sectionHeader">
          <h2>My Courses</h2>
          <button>Create Course</button>
        </div>

        <div className="courseTable">

          <div className="courseRow heading">
            <span>Course</span>
            <span>Students</span>
            <span>Progress</span>
          </div>

          <div className="courseRow">
            <span>Complete React Course</span>
            <span>185</span>
            <span>78%</span>
          </div>

          <div className="courseRow">
            <span>Node.js Backend</span>
            <span>132</span>
            <span>65%</span>
          </div>

          <div className="courseRow">
            <span>MongoDB Mastery</span>
            <span>110</span>
            <span>71%</span>
          </div>

        </div>

      </div>

      <div className="dashboardSection">

        <h2>Recent Student Activity</h2>

        <div className="activityList">

          <div className="activityCard">
            Rahul completed "React Hooks".
          </div>

          <div className="activityCard">
            Priya enrolled in "Node.js Backend".
          </div>

          <div className="activityCard">
            Aman earned the React Certificate.
          </div>

        </div>

      </div>

    </div>
  );
};

export default TeacherDashboard;