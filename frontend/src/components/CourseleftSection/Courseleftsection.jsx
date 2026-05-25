import React from 'react'
import './Courseleftsection.css'

const Courseleftsection = (props) => {

  function handleclick(url){
    window.open(url, '_blank');
  };

  return (
    <div className='courseleftsection'>
      <div className="thumbnail">
        <img src={props.thumbnail} alt="Refresh the Page..." />
        </div> 

      <div className="details">
        <div className="vdoDetails">
          <div className="title">{props.title}</div>
          <div className="duration">{props.duration}</div>
          <div className="description">{props.description}</div>
        </div>

        <div className="explore">
          <button onClick={()=>handleclick(props.link)}>
          Explore
          </button>
        </div>
        </div>     
    </div>
  )
}

export default Courseleftsection
