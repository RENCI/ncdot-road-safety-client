import React, { useState, useRef } from 'react'
import { Alert } from 'antd'
import PropTypes from 'prop-types'
import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons'
import './image.css'

export const Image = ({ url, loading, present, onLoad, onClick, onKeyPress }) => { 
  const [error, setError] = useState(false)
  const [pointerDown, setPointerDown] = useState(false)
  const [drag, setDrag] = useState(false)
  const [brightness, setBrightness] = useState(1)
  const [contrast, setContrast] = useState(1)
  const imageRef = useRef()

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

  const handleClick = evt => {
    if (!evt.shiftKey && evt.button === 0) {
      onClick()
    }
  }

  const onDoubleClick = evt => {
    if (evt.shiftKey && evt.button === 0) {
      setBrightness(1)
      setContrast(1)
    }
  }

  const onError = () => {
    setError(true)
  }

  const onMouseOver = () => {
    imageRef.current.focus({ preventScroll: true })
  }

  const onMouseOut = () => {
    imageRef.current.blur()
  }

  const filterString = `brightness(${ brightness * 100 }%) contrast(${ contrast * 100}%)`

  return (
    <div className='imageDiv'>
      { error ? 
        <Alert 
          type='error' 
          message={ 'Error loading ' + url } 
          showIcon
        />
      :
        <>
          <img 
            ref={ imageRef }
            src={ url } 
            tabIndex='-1'
            width='100%' 
            style={{ 
              visibility: loading ? "hidden" : "visible",
              filter: filterString,  
              cursor: drag ? 'move' : onClick ? 'pointer' : 'default' 
            }}
            draggable='false'
            onLoad={ onLoad } 
            onPointerDown={ onPointerDown }
            onPointerMove={ onPointerMove }
            onPointerUp={ onPointerUp }
            onClick={ onClick ? handleClick : null }
            onDoubleClick={ onDoubleClick }
            onError={ onError }
            onMouseOver={ onMouseOver }
            onMouseOut={ onMouseOut }
            onKeyPress={ onKeyPress }
          />     
          { loading ? null
            : present === "present" ? <CheckCircleOutlined className='imageIcon checkIcon' /> 
            : present === "irrelevant" ? <StopOutlined className='imageIcon exclamationIcon' /> 
            : null
          }
        </>
      }
    </div>
  )
}

Image.propTypes = {
  url: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  present: PropTypes.string,
  onLoad: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  onKeyPress: PropTypes.func
}