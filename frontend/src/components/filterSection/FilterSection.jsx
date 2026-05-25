import React from 'react'
import './FilterSection.css'

const FilterSection = (props) => {
  return (
    <div className='filtersection'>
        <select className='categoryfilter' value={props.category} onChange={(e)=>props.setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="web">Web Development</option>
            <option value="DSA">DSA</option>
            <option value="AI/ML">AI/ML</option>
            <option value="language">Language</option>
            <option value="videoEdition">Video Editing</option>
            <option value="photoEditing">Photo Editing</option>
            <option value="graphicDesigning">Graphic Designing</option>
            <option value="database">Database</option>
        </select>

        <select className="durationfilter" value={props.level} onChange={(e)=>props.setLevel(e.target.value)}>
            <option value="">All Duration</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
        </select>
    </div>
  )
}

export default FilterSection
