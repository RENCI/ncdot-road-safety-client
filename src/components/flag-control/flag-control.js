import React, { useState } from 'react'
import { Tooltip, Tag, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import './flag-control.css'

export const FlagControl = ({ flag, comment, options, onFlagChange, onCommentChange }) => {
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [flags, setFlags] = useState({})

  const onKeyPress = evt => {
    evt.stopPropagation()
  }
  const onTagClick = tag => {
    const newFlags = {...flags}
    newFlags[tag] = !newFlags[tag]

    setFlags(newFlags)
  }

  const showInputClick = () => {
    //saveInputRef.current.focus()
    setShowInput(true);
  };

  const handleInputChange = evt => {
    setInputValue(evt.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && options.indexOf(inputValue) === -1) {
      // XXX: Dispatch this
      //options = [...tags, inputValue];
    }

    setShowInput(false)
    setInputValue('')
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
      {showInput ?
      <div
      className='addFlagInput'>
        <Input
          autoFocus
          type="text"
          size="small"
          className="tag-input"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
        </div>
      :
        <Tag 
          className='addFlagTag' 
          color='blue'
          onClick={showInputClick}
        >
          <PlusOutlined /> New flag
        </Tag>
      }
    </div>
  )
}