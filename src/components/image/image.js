import React, { useState, useRef, useEffect } from 'react'
import { Alert } from 'antd'
import PropTypes from 'prop-types'
import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons'
import { getAutoAdjustValues } from './auto-adjust'
import './image.css'

export const Image = ({ url, loading, present, autoAdjust, onLoad, onClick, onKeyPress }) => { 
  const [error, setError] = useState(false)
  const [pointerDown, setPointerDown] = useState(false)
  const [drag, setDrag] = useState(false)
  const [autoBrightness, setAutoBrightness] = useState(1)
  const [autoContrast, setAutoContrast] = useState(1)
  const [brightness, setBrightness] = useState(1)
  const [contrast, setContrast] = useState(1)

  const imageRef = useRef()
  const canvasRef = useRef()

  const canvasWidth = 100
  const canvasHeight = 100

  const movementScale = 0.01;

  useEffect(() => {
    if (autoAdjust) {
      setBrightness(autoBrightness)
      setContrast(autoContrast)
    }
    else {
      setBrightness(1)
      setContrast(1)
    }
  }, [autoAdjust])

  const intensity = (r, g, b) => r * 0.299 + g * 0.587 + b * 0.114

  const getIntensities = pixels => {
    // Return array of intensities from rgba array
    let intensities = [];

    for (let i = 0; i < pixels.length; i += 4) {
      intensities.push(intensity(pixels[i], pixels[i + 1], pixels[i + 2]));
    }

    return intensities
  }

  const mean = values => values.reduce((sum, value) => sum + value, 0) / values.length

  const stdDev = (values, mean) => Math.sqrt(values.reduce((sum, value) => {
    const v = value - mean
    return sum + v * v
  }, 0) / values.length)

  const onImageLoad = () => {
    const { brightness, contrast } = getAutoAdjustValues(imageRef, canvasRef)

    setAutoBrightness(brightness)
    setAutoContrast(contrast)

    if (autoAdjust) {
      setBrightness(brightness)
      setContrast(contrast)
    }

    onLoad()
  }

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
      if (autoAdjust) {
        setBrightness(autoBrightness)
        setContrast(autoContrast)
      }
      else {
        setBrightness(1)
        setContrast(1)
      }
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

  const filterString = `brightness(${ brightness })contrast(${ contrast })`

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
            onLoad={ onImageLoad } 
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
          <canvas 
            ref={ canvasRef } 
            width={ canvasWidth } 
            height={ canvasHeight } 
            style={{ display: 'none' }} 
          />
        </>
      }
    </div>
  )
}

Image.propTypes = {
  url: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  present: PropTypes.string,
  autoAdjust: PropTypes.bool,
  onLoad: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  onKeyPress: PropTypes.func
}