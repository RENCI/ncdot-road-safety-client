import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { api } from '../../api'
import './scene.css'

const pointerDown = false;
const drag = false;

const Image = ({ url, present, handleClick }) => { 
  const [brightness, setBrightness] = useState(1)
  const [contrast, setContrast] = useState(1)
  const [loading, setLoading] = useState(true)

  const movementScale = 0.01;

  useEffect(() => {
    setLoading(true)
  }, [url])

  const handlePointerDown = evt => {
    if (evt.pointerId === 0) {
      pointerDown = true;
      drag = false;

      evt.target.setPointerCapture(evt.pointerId)
    }
  }

  const handlePointerMove = evt => {    
    if (pointerDown) {
      drag = true;

      setBrightness(brightness - evt.movementY * movementScale)
      setContrast(contrast + evt.movementX * movementScale)
    }
  }
  
  const handlePointerUp = () => {
    pointerDown = false;

    if (!drag && handleClick) {
      handleClick()
    }
  }

  const handleKeyUp = evt => {
    if (evt.key === 'r') {
      setBrightness(1)
      setContrast(1)
    }
  }

  const handleLoad = () => {
    setLoading(false)
  }

  const filterString = `brightness(${ brightness * 100 }%) contrast(${ contrast * 100}%)`

  return (
    <div className='imageDiv'>
      { loading && <Spin /> }
      <img 
        src={ url } 
        tabIndex='-1'
        width='100%' 
        style={{ 
          filter: filterString,  
          cursor: handleClick ? 'pointer' : null 
        }}
        draggable='false'
        onPointerDown={ handlePointerDown }
        onPointerMove={ handlePointerMove }
        onPointerUp={ handlePointerUp }
        onKeyUp={ handleKeyUp }
        onLoad={ handleLoad } />     
      { present ? <CheckCircleOutlined className="checkIcon"/> : null }
    </div>
  )
}

export const Scene = ({ id, present, handleClick }) => {
  console.log(id, present)

  return (
    <div className='scene'>
      <Image 
        url={ api.getImage(id, 'left') } 
        present={ present['left'] }
        handleClick={ handleClick ? () => handleClick(id, 'left') : null } />
      <Image 
        url={ api.getImage(id, 'front') } 
        present={ present['front'] } />
      <Image 
        url={ api.getImage(id, 'right') } 
        present={ present['right'] }
        handleClick={ handleClick ? () => handleClick(id, 'right') : null } />
    </div>
  )
}

Scene.propTypes = {
  id: PropTypes.string.isRequired,
  present: PropTypes.object,
  handleClick: PropTypes.func
}