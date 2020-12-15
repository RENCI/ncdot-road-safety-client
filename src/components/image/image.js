import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CheckCircleOutlined } from '@ant-design/icons'
import './image.css'

export const Image = ({ url, loading, present, handleLoad, handleClick }) => { 
  const [pointerDown, setPointerDown] = useState(false)
  const [drag, setDrag] = useState(false)
  const [brightness, setBrightness] = useState(1)
  const [contrast, setContrast] = useState(1)

  const movementScale = 0.01;

  const handlePointerDown = evt => {
    if (evt.button === 0) {
      evt.target.setPointerCapture(evt.pointerId)

      setPointerDown(true)

      if (evt.shiftKey) {
        setDrag(true)
      }
    }
  }

  const handlePointerMove = evt => {    
    if (pointerDown && evt.shiftKey) {
      setBrightness(brightness - evt.movementY * movementScale)
      setContrast(contrast + evt.movementX * movementScale)
      setDrag(true)
    }
    else if (drag) {
      setDrag(false)
    }
  }
  
  const handlePointerUp = () => {
    setPointerDown(false)
    setDrag(false)
  }

  const onClick = evt => {
    if (!evt.shiftKey && evt.button === 0) {
      handleClick()
    }
  }

  const handleDoubleClick = evt => {
    if (evt.shiftKey && evt.button === 0) {
      setBrightness(1)
      setContrast(1)
    }
  }

  const filterString = `brightness(${ brightness * 100 }%) contrast(${ contrast * 100}%)`

  return (
    <div className='imageDiv'>
      <img 
        src={ url } 
        tabIndex='-1'
        width='100%' 
        style={{ 
          visibility: loading ? "hidden" : "visible",
          filter: filterString,  
          cursor: drag ? 'move' : handleClick ? 'pointer' : 'default' 
        }}
        draggable='false'
        onLoad={ handleLoad } 
        onPointerDown={ handlePointerDown }
        onPointerMove={ handlePointerMove }
        onPointerUp={ handlePointerUp }
        onClick={ handleClick ? onClick : null }
        onDoubleClick={ handleDoubleClick }/>     
      { present && !loading ? <CheckCircleOutlined className='checkIcon' /> : null }
    </div>
  )
}

Image.propTypes = {
  url: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  present: PropTypes.bool,
  handleLoad: PropTypes.func.isRequired,
  handleClick: PropTypes.func
}