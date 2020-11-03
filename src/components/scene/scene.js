import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import { api } from '../../api'
import './scene.css'

const Image = ({ url }) => {  
  const [down, setDown] = useState(false)
  const [brightness, setBrightness] = useState(1)
  const [contrast, setContrast] = useState(1)
  const [loading, setLoading] = useState(true)

  const movementScale = 0.01;

  console.log(brightness, contrast)

  useEffect(() => {
    setLoading(true)
  }, [url])

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

  const handleLoad = () => {
    setLoading(false)
  }

  const filterString = `brightness(${ brightness * 100 }%) contrast(${ contrast * 100}%)`

  return (
    <div className='imageDiv'>
      { loading && <Spin /> }
      <img 
        src={ url } 
        width='100%' 
        style={{ filter: filterString }}
        draggable='false'
        onPointerDown={ handlePointerDown }
        onPointerMove={ handlePointerMove }
        onPointerUp={ handlePointerUp }
        onDoubleClick={ handleDoubleClick }
        onLoad={ handleLoad }
      />     
    </div>
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