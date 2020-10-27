import React from 'react'
import { Row, Col, Switch } from 'antd'
import { Scene } from '../scene'
import './annotation-panel.css'

export const AnnotationPanel = ({ id, annotation }) => {
  return (    
    <div className='panel'>
      <Scene id={ id } />

      <div className='toggle'>
        <div>Contains&nbsp;{ annotation }?</div>
        <div><Switch /></div>
      </div>
    </div>
  )
}