import React, { useContext, useState, useRef } from 'react'
import { AnnotationBrowserContext } from '../../contexts'
import { Scene } from '../scene'
import { FlagControl } from '../flag-control'
import './annotation-panel.css'

export const AnnotationPanel = ({ image, flagOptions, userFlagOptions, flagShortcuts }) => {
  const tooltipTimeout = useRef()
  const [popoverVisible, setPopoverVisible] = useState(false)
  const [tooltip, setTooltip] = useState(null)
  const [, dispatch] = useContext(AnnotationBrowserContext)

  const { id, present, flags } = image;

  const onImageClick = (id, view) => {
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

  const onFlagChange = flag => {
    const newFlags = flags.includes(flag) ? 
      flags.filter(currentFlag => currentFlag !== flag) :
      flags.concat(flag)

    dispatch({
      type: 'setFlags',
      id: id,
      flags: newFlags
    })
  }

  const onPopoverVisibleChange = visible => {
    setPopoverVisible(visible)
  }

  const onRemoveUserFlagOption = option => {
    dispatch({
      type: 'removeUserFlagOption',
      option: option
    })
  }

  const onImageKeyPress = evt => {
    const flag = Object.keys(flagShortcuts).find(flag => flagShortcuts[flag].key === evt.key.toLowerCase())

    if (flag) {
      onFlagChange(flag)

      if (flags.includes(flag)) {
        setTooltip("Removed " + flag)        
      }
      else {
        setTooltip("Added " + flag)
      }

      if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current)

      tooltipTimeout.current = setTimeout(() => setTooltip(null), 3000)
    }
  }

  return (    
    <div className='annotationPanel'>
      <FlagControl        
        flags={ flags }
        options={ flagOptions }
        userOptions={ userFlagOptions }
        shortcuts={ flagShortcuts }
        tooltip={ tooltip }
        onFlagChange={ onFlagChange }
        onPopoverVisibleChange={ onPopoverVisibleChange }
        onRemoveUserFlagOption={ onRemoveUserFlagOption }
      />
      <Scene 
        id={ id } 
        present={ present }                 
        onClick={ onImageClick }
        onKeyPress={ onImageKeyPress }
      />      
      { popoverVisible && <div className='overlay' /> }
    </div>
  )
}