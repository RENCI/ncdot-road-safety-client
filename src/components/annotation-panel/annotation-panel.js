import React from 'react'
import { Scene } from '../scene'
import './annotation-panel.css'

export const AnnotationPanel = ({ image, handleClick }) => {
  return (    
    <div className='annotationPanel'>
      <Scene 
        id={ image.id } 
        present={ image.present } 
        handleClick={ handleClick } />
    </div>
  )
}