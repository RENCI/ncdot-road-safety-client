import React from 'react'
import { Switch } from 'antd'
import { Scene } from '../scene'
import './annotation-panel.css'

export const AnnotationPanel = ({ image, annotation, handleChange }) => {
  return (    
    <div className='panel'>
      <div className='toggle'>
        <div>Contains&nbsp;{ annotation }?</div>        
        <br />
        <Switch           
          checked={ image.checked }
          onChange={ handleChange } />
      </div>

      <Scene id={ image.id } />
    </div>
  )
}