import React, { useState, useRef, useEffect } from 'react'
import { Alert } from 'antd'
import PropTypes from 'prop-types'
import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons'
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

  const canvasWidth = 400
  const canvasHeight = 300

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

  const RGBToYCbCr = v => ([ 
    Math.round(0.299 * v[0] + 0.587 * v[1] + 0.114 * v[2]),
    128 - 0.168736 * v[0] - 0.331264 * v[1] + 0.5 * v[2],
    128 + 0.5 * v[0] - 0.418688 * v[1] - 0.081312 * v[2]
  ])

  const YCbCrToRGB = v => ([
    v[0] + 1.402 * (v[2] - 128),
    v[0] - 0.344136 * (v[1] - 128) - 0.714136 * (v[2] - 128),
    v[0] + 1.772 * (v[1] - 128) 
  ])

  const intensity = (r, g, b) => Math.max(0, Math.min(Math.round(r * 0.299 + g * 0.587 + b * 0.114), 255))

  const adaptiveHistogramEqualization = image => {
    // Based on code from here: http://www.songho.ca/dsp/histogram/histogram.html

    const numValues = 256
    const maxValue = 255

    // Compute YCbCr values
    const pixels = image.data
    const YCbCr = []
    for (let i = 0; i < pixels.length; i += 4) {
      YCbCr.push(RGBToYCbCr([pixels[i], pixels[i + 1], pixels[i + 2]]));
    }

    // Compute histogram
    const histogram = Array(numValues).fill(0)
    for (let i = 0; i < YCbCr.length; i ++) {
      histogram[YCbCr[i][0]]++
    }

    // Compute lookup table
    let sum = 0    
    let lut = Array(numValues).fill(0)
    for (let i = 0; i < numValues; i++) {
      sum += histogram[i]
      lut[i] = sum * maxValue / YCbCr.length
    }
    
    // Compute new pixel values
    for (let i = 0; i < pixels.length; i += 4) {
      const ycc = YCbCr[i / 4]
      ycc[0] = lut[ycc[0]]

      const rgb = YCbCrToRGB(ycc)

      pixels[i] = rgb[0]
      pixels[i + 1] = rgb[1]
      pixels[i + 2] = rgb[2]
    }    

    return image
  }

  const getIntensities = pixels => {
    // Return array of intensities from rgba array
    let intensities = [];

    for (let i = 0; i < pixels.length; i += 4) {
      intensities.push((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
    }

    return intensities
  }

  const mean = values => values.reduce((sum, value) => sum + value, 0) / values.length

  const median = values => {
    const v = values.slice().sort((a, b) => a - b)
    const i = v.length / 2

    return v.length % 2 === 0 ? (v[i] + v[i + 1]) / 2 : v[Math.round(i)]
  }

  const quartile = (values, q) => {
    const v = values.slice().sort((a, b) => a - b)
    const i = v.length * q

    console.log(i)
    console.log(v[i])

    return Number.isInteger(i) ? (v[i] + v[i + 1]) / 2 : v[Math.round(i)]
  }

  const stdDev = (values, mean) => Math.sqrt(values.reduce((sum, value) => {
    const v = value - mean
    return sum + v * v
  }, 0) / values.length)

  const onImageLoad = () => {
    const context = canvasRef.current.getContext("2d")
    
    context.drawImage(imageRef.current, 0, 0, canvasWidth, canvasHeight)
    const image = context.getImageData(0, 0, canvasWidth, canvasHeight)

    const intensities = getIntensities(image.data)
    const m = mean(intensities)
    //const m = median(intensities)

    const qLow = quartile(intensities, 0.01)
    const qHigh = quartile(intensities, 0.99)

    const q = Math.max(m - qLow, qHigh - m)

    console.log(m, qLow, qHigh, q)

    //console.log(mean(intensities), m, quartile(intensities, 0.5))


    const sd = stdDev(intensities, m)

    const brightness = m === 0 ? 1 : 128 / m
    const contrast = Math.max(1, 128 / (sd * 5))
    //const contrast = q === 0 ? 1 : 128 / q



    setAutoBrightness(brightness)
    setAutoContrast(contrast)

    if (autoAdjust) {
      setBrightness(brightness)
      setContrast(contrast)
    }

    onLoad()


    adaptiveHistogramEqualization(image)

    context.putImageData(image, 0, 0)
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
          <img 
            src={ url } 
            tabIndex='-1'
            width='100%' 
          />     
          <canvas 
            ref={ canvasRef } 
            width={ canvasWidth } 
            height={ canvasHeight } 
            //style={{ display: 'none' }} 
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