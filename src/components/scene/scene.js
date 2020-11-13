import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { api } from '../../api'
import './scene.css'

const Image = ({ url, present, handleClick }) => { 
  const [pointerDown, setPointerDown] = useState(false)
  const [drag, setDrag] = useState(false)
  const [brightness, setBrightness] = useState(1)
  const [contrast, setContrast] = useState(1)
  const [loading, setLoading] = useState(true)

  const movementScale = 0.01;

  useEffect(() => {
    setLoading(true)
  }, [url])

  const handlePointerDown = evt => {
    if (evt.button === 0) {
      evt.target.setPointerCapture(evt.pointerId)

      setPointerDown(true)
      setDrag(false)
    }
  }

  const handlePointerMove = evt => {    
    if (pointerDown) {
      setDrag(true)
      setBrightness(brightness - evt.movementY * movementScale)
      setContrast(contrast + evt.movementX * movementScale)
    }
  }
  
  const handlePointerUp = () => {
    if (!drag && handleClick) {
      handleClick()
    }

    setPointerDown(false)
    setDrag(false)
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
          cursor: drag ? 'move' : handleClick ? 'pointer' : 'default' 
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
  return (
    <div className='scene'>
      <Image 
        url={ api.getImage(id, 'left') } 
        present={ present ? present['left'] : null }
        handleClick={ handleClick ? () => handleClick(id, 'left') : null } />
      <Image 
        url={ api.getImage(id, 'front') } 
        present={ present ? present['front'] : null } />
      <Image 
        url={ api.getImage(id, 'right') } 
        present={ present ? present['right'] : null }
        handleClick={ handleClick ? () => handleClick(id, 'right') : null } />
    </div>
  )
}

Scene.propTypes = {
  id: PropTypes.string.isRequired,
  present: PropTypes.object,
  handleClick: PropTypes.func
}