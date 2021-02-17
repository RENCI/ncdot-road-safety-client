import React, { useContext, useState } from 'react'
import { AnnotationBrowserContext } from '../../contexts'
import { Scene } from '../scene'
import { FlagControl } from '../flag-control'
import './annotation-panel.css'

export const AnnotationPanel = ({ image, flagOptions, userFlagOptions, flagShortcuts }) => {
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

  const onPopoverVisibleChange = visible => {
    setPopoverVisible(visible)
  }

  const onImageKeyPress = evt => {
    const flag = 
    
    flagOptions.concat(userFlagOptions).find(flag => {
      return flag[0].toLowerCase() === evt.key.toLowerCase()
    })

    if (flag) {
      onFlagChange(flag)

      if (flags.includes(flag)) {
        setTooltip("Removed " + flag)        
      }
      else {
        setTooltip("Added " + flag)
      }

      setTimeout(() => setTooltip(null), 3000)
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