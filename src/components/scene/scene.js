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
        onClick={ handleClick ? onClick : null }
        onDoubleClick={ handleDoubleClick }
        onLoad={ handleLoad } />     
      { present ? <CheckCircleOutlined className='checkIcon' /> : null }
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