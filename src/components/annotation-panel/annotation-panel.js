import React, { useContext, useState } from 'react'
import { Popover, Button, Switch, Input } from 'antd'
import { FlagOutlined } from '@ant-design/icons'
import { AnnotationBrowserContext } from '../../contexts'
import { Scene } from '../scene'
import './annotation-panel.css'

export const AnnotationPanel = ({ image }) => {
  const [, dispatch] = useContext(AnnotationBrowserContext)

  const { id, present, flag, comment } = image;

  const handleImageClick = (id, view) => {
    const viewPresent = present ? !present[view] : true

    dispatch({
      type: 'setAnnotationPresent',
      id: id,
      view: view,
      present: viewPresent
    })
  }

  const onSwitchClick = () => {
    dispatch({
      type: 'setFlag',
      id: id,
      flag: !flag
    })
  }

  const onKeyPress = evt => {
    evt.stopPropagation()
  }

  const onChange = evt => {
    dispatch({
      type: 'setComment',
      id: id,
      comment: evt.target.value
    })
  }

  const popoverContent = () => {
    return (
      <div className='popoverContent'>
        <Input 
          placeholder='Describe issue'
          disabled={ !flag }
          value={ flag ? comment : '' }
          onKeyPress={ onKeyPress }
          onChange={ onChange } 
        />
        <Switch 
          className='popoverSwitch'
          checked={ flag }
          onClick={ onSwitchClick } />      
      </div>
    )
  }

  return (    
    <div className='annotationPanel'>
      <Scene 
        id={ id } 
        present={ present } 
        handleClick={ handleImageClick } />
      <div className='flagButton' >
        <Popover
          content={ popoverContent } 
          placement='topRight'
          trigger='hover'                    
        >
          <Button            
            type={ flag ? 'primary' : 'default' }
            shape='circle'
            icon={ <FlagOutlined /> } />
        </Popover>
      </div>
    </div>
  )
}