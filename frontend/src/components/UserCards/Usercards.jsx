import React from "react";
import user from "../../assets/dummy user.png";
import "./Usercards.css";

const Usercards = (props) => {
  return (
    <div className="usercard">
      <div className="image">
        <img src={user} alt="" />
      </div>

      <div className="userinfo">
        <div className="name">{props.name}</div>
        <div className="course">Enrolled in : {props.course}</div>
      </div>
    </div>
  );
};

export default Usercards;
  