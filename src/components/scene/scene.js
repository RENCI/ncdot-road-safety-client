import React from 'react'
import PropTypes from 'prop-types'
import { Image } from '../image'
import { api } from '../../api'
import './scene.css'

export const Scene = ({ id, present, handleClick }) => {
  const hasAnnotation = present ? Object.values(present).reduce((p, c) => p || c, false) : false

  return (
    <div 
      className='scene' 
      style={{ 
        outline: hasAnnotation ? "6px solid #52c41a" : null
      }}
    >
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