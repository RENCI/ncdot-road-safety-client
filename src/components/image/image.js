import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { message } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import './image.css'

export const Image = ({ url, loading, present, handleLoad, handleClick }) => { 
  const [pointerDown, setPointerDown] = useState(false)
  const [drag, setDrag] = useState(false)
  const [brightness, setBrightness] = useState(1)
  const [contrast, setContrast] = useState(1)

  const movementScale = 0.01;

  const onPointerDown = evt => {
    if (evt.button === 0) {
      evt.target.setPointerCapture(evt.pointerId)

      setPointerDown(true)

      if (evt.shiftKey) {
        setDrag(true)
      }
    }
  }

  const onPointerMove = evt => {    
    if (pointerDown && evt.shiftKey) {
      setBrightness(brightness - evt.movementY * movementScale)
      setContrast(contrast + evt.movementX * movementScale)
      setDrag(true)
    }
    else if (drag) {
      setDrag(false)
    }
  }
  
  const onPointerUp = () => {
    setPointerDown(false)
    setDrag(false)
  }

  const onClick = evt => {
    if (!evt.shiftKey && evt.button === 0) {
      handleClick()
    }
  }

  const onDoubleClick = evt => {
    if (evt.shiftKey && evt.button === 0) {
      setBrightness(1)
      setContrast(1)
    }
  }

  const onError = evt => {
    message.error('Error loading ' + url, 0)
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
        onPointerDown={ onPointerDown }
        onPointerMove={ onPointerMove }
        onPointerUp={ onPointerUp }
        onClick={ handleClick ? onClick : null }
        onDoubleClick={ onDoubleClick }
        onError={ onError }
      />     
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