import React, { useState } from 'react'
import { Tooltip, Tag } from 'antd'
import './flag-control.css'

export const FlagControl = ({ flag, comment, options, onFlagChange, onCommentChange }) => {
  const [flags, setFlags] = useState({})

  const onKeyPress = evt => {
    evt.stopPropagation()
  }
  const onTagClick = tag => {
    const newFlags = {...flags}
    newFlags[tag] = !newFlags[tag]

    setFlags(newFlags)
  }

  return (    
    <div className="flagDiv">
      { options.map((option, i) => (
        <Tooltip 
          key={ i }
          title={ option }
          placement="left"
          mouseEnterDelay={ 0 }
          mouseLeaveDelay= { 0 }
        >
          <Tag 
            key={ i }
            className='flag'
            color={ flags[option] ? '#108ee9' : 'blue' } 
            onClick={ () => onTagClick(option) }
          >
            { option }
          </Tag>
        </Tooltip>
      ))}
    </div>
  )
}