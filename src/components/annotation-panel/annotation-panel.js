import React, { useContext, useState } from 'react'
import { AnnotationBrowserContext } from '../../contexts'
import { Scene } from '../scene'
import { FlagControl } from '../flag-control'
import './annotation-panel.css'

export const AnnotationPanel = ({ image, flagOptions, userFlagOptions }) => {
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

  const onFlagChange = newFlags => {     
    dispatch({
      type: 'setFlags',
      id: id,
      flags: newFlags
    })

    // Send any user flag changes
    const oldUserFlags = flags.filter(flag => !flagOptions.includes(flag))
    const newUserFlags = newFlags.filter(flag => !flagOptions.includes(flag))

    const addFlags = newUserFlags.filter(flag => !oldUserFlags.includes(flag))
    const removeFlags = oldUserFlags.filter(flag => !newUserFlags.includes(flag))

    if (addFlags.length > 0 || removeFlags.length > 0) {
      dispatch({ 
        type: 'updateUserFlags',
        addFlags: addFlags,
        removeFlags: removeFlags
      })
    }
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
        userOptions={ userFlagOptions }
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