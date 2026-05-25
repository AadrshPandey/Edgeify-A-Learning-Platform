import React from "react";
import "./Courserightsection.css";

const Courserightsection = (props) => {

  function handleclick(url){
    window.open(url, '_blank');
  };

  return (
    <div className="courserightsection">
      <div className="details">
        <div className="vdoDetails">
          <div className="title">{props.title}</div>
          <div className="duration">{props.duration}</div>
          <div className="description">{props.description}</div>
        </div>

        <div className="explore">
          <button onClick={()=>handleclick(props.link)}>Explore</button>
        </div>
      </div>

      <div className="thumbnail">
        <img
          src={props.thumbnail}
          alt="Refresh the Page..."
        />
      </div>
    </div>
  );
};

export default Courserightsection;
