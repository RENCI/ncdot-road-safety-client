import React, { useContext, useState } from 'react'
import { AnnotationBrowserContext } from '../../contexts'
import { Scene } from '../scene'
import { FlagControl } from '../flag-control'
import './annotation-panel.css'

export const AnnotationPanel = ({ image, flagOptions }) => {
  const [popoverVisible, setPopoverVisible] = useState(false)
  const [, dispatch] = useContext(AnnotationBrowserContext)

  const { id, present, flags } = image;

  const handleImageClick = (id, view) => {
    const viewPresent = 
      present ? present[view] === "absent" ? "present" : present[view] === "present" ? "irrelevant" : "absent"
      : "absent"

    dispatch({
      type: 'setAnnotationPresent',
      id: id,
      view: view,
      present: viewPresent
    })
  }

  const onFlagChange = flags => {     
    dispatch({
      type: 'setFlags',
      id: id,
      flags: flags
    })
  }

  // XXX: This work for this panel, but need to push up to handle all panels
  const onPopoverVisibleChange = visible => {
    setPopoverVisible(visible)
  }

  return (    
    <div className='annotationPanel'>
      <FlagControl        
        flags={ flags }
        options={ flagOptions }
        onFlagChange={ onFlagChange }
        onPopoverVisibleChange={ onPopoverVisibleChange }
      />
      <Scene 
        id={ id } 
        present={ present }                 
        handleClick={ handleImageClick }         
      />      
      { popoverVisible && <div className='overlay' /> }
    </div>
  )
}