import React, { useContext, useState, useRef } from 'react'
import { AnnotationBrowserContext, useAccount } from '../../contexts'
import { Scene } from '../scene'
import { FlagControl } from '../flag-control'
import './annotation-panel.css'

export const AnnotationPanel = ({ image, autoAdjust, downsample, flagOptions, userFlagOptions, flagShortcuts }) => {
  const {} = useAccount()
  const tooltipTimeout = useRef()
  const [popoverVisible, setPopoverVisible] = useState(false)
  const [tooltip, setTooltip] = useState(null)
  const [, dispatch] = useContext(AnnotationBrowserContext)

  const { id, aspectRatio, present, flags } = image;

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

  const onKeyPress = evt => {
    const flag = Object.keys(flagShortcuts).find(flag => flagShortcuts[flag].key === evt.key.toLowerCase())

    if (flag) {
      onFlagChange(flag)

      if (popoverVisible) {
        setTooltip(null)

        if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current)
      }
      else {
        if (flags.includes(flag)) {
          setTooltip('Removed ' + flag)        
        }
        else {
          setTooltip('Added ' + flag)
        }

        if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current)

        tooltipTimeout.current = setTimeout(() => setTooltip(null), 3000)
      }
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
        onKeyPress= { onKeyPress }
      />

      <Scene 
        id={ id } 
        aspectRatio={ aspectRatio }
        present={ present }                 
        autoAdjust={ autoAdjust }
        downsample={ downsample }
        onClick={ onImageClick } 
        onKeyPress={ onKeyPress }
      />      
      { popoverVisible && <div className='overlay' /> }
    </div>
  )
}