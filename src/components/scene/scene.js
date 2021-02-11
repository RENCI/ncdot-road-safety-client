import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import { Image } from '../image'
import { api } from '../../api'
import './scene.css'

export const Scene = ({ id, present, handleClick }) => {
  const hasAnnotation = present ? Object.values(present).reduce((p, c) => {
    return p === 'irrelevant' || c === 'irrelevant' ? 'irrelevant'
      : p === 'present' || c === 'present' ? 'present'
      : 'absent'
   }, 'absent') : 'absent' 

  const [loadedCount, setLoadedCount] = useState(0)
  
  useEffect(() => {
    setLoadedCount(0)
  }, [id])

  const loading = loadedCount < 3

  const handleLoad = () => {
    setLoadedCount(loadedCount + 1)
  }

  return (
    <div 
      className='scene' 
      style={{ 
        outline: loading ? null :
          hasAnnotation === 'present' ? '6px solid #52c41a' : // XXX: Magic number matching value in image.css
          hasAnnotation === 'irrelevant' ? '6px solid #ebc815' : // XXX: Magic number matching value in image.css
          null
      }}
    >
      { loading && <Spin className='spinner'/> }
      <Image 
        url={ api.getImage(id, 'left') } 
        loading={ loading }
        present={ present ? present.left : null }
        handleLoad={ handleLoad }
        handleClick={ handleClick ? () => handleClick(id, 'left') : null } />
      <Image 
        url={ api.getImage(id, 'front') } 
        loading={ loading }
        present={ present ? present.front : null }
        handleLoad={ handleLoad } 
        handleClick={ handleClick ? () => handleClick(id, 'front') : null } />
      <Image 
        url={ api.getImage(id, 'right') } 
        loading={ loading }
        present={ present ? present.right : null }
        handleLoad={ handleLoad }
        handleClick={ handleClick ? () => handleClick(id, 'right') : null } />        
    </div>
  )
}

Scene.propTypes = {
  id: PropTypes.string.isRequired,
  present: PropTypes.object,
  handleClick: PropTypes.func
}