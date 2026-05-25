import React from 'react'
import './Coursecard.css'
import arrow from '../../assets/arrow.png'

const Coursescard = (props) => {

    function handleCLick(url){
        window.open(url, '_blank');
    }

  return (
    <div className='Coursecard'>
        <div className="thumbnail">
            <img src={props.thumbnail} alt="" />
        </div>
        <div className="Coursesdescription">
            <div className="Coursestitle">{props.title}</div>
            <div className="Coursesinfo">
                <div className="Coursesduration">Duration: {props.duration}</div>
                <div className="Coursescategory">Catefory: {props.category}</div>
            </div>
            <div className="Coursesexplore">
                <button onClick={()=>(handleCLick(props.link))}>Explore</button>
                <img src={arrow} alt=""  onClick={()=>(handleCLick(props.link))}/>
            </div>
        </div>

    </div>
  )
}

export default Coursescard
