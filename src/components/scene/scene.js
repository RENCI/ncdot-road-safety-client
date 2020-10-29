import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { api } from '../../api'
import './scene.css'

const Image = ({ url }) => {  
  const [down, setDown] = useState(false)
  const [brightness, setBrightness] = useState(1)
  const [contrast, setContrast] = useState(1)

  const movementScale = 0.01;

  const handlePointerDown = evt => {
    setDown(true)
    evt.target.setPointerCapture(evt.pointerId)
  }

  const handlePointerMove = evt => {
    if (down) {
      setBrightness(brightness - evt.movementY * movementScale)
      setContrast(contrast + evt.movementX * movementScale)
    }
  }
  
  const handlePointerUp = () => {
    setDown(false)
  }

  const handleDoubleClick = () => {
    setBrightness(1)
    setContrast(1)
  }

  const filterString = `brightness(${ brightness * 100 }%) contrast(${ contrast * 100}%)`

  return (
    <img 
      src={ url } 
      width='33%' 
      style={{ filter: filterString }}
      draggable='false'
      onPointerDown={ handlePointerDown }
      onPointerMove={ handlePointerMove }
      onPointerUp={ handlePointerUp }
      onDoubleClick={ handleDoubleClick }
    />     
  )
}

export const Scene = ({ id }) => {
  return (
    <div className='scene'>
      <Image url={ api.getImage(id, 'left') } />
      <Image url={ api.getImage(id, 'front') } />
      <Image url={ api.getImage(id, 'right') } />
    </div>
  )
}

Scene.propTypes = {
  id: PropTypes.string.isRequired,
}