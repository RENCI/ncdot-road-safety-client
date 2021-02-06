import React, { useContext, useState, useRef } from 'react'
import { Popover, Button, Switch, Input, AutoComplete } from 'antd'
import { FlagOutlined, CheckOutlined } from '@ant-design/icons'
import { AnnotationBrowserContext } from '../../contexts'
import { Scene } from '../scene'
import './annotation-panel.css'

export const AnnotationPanel = ({ image }) => {
  const [, dispatch] = useContext(AnnotationBrowserContext)
  const [showPopover, setShowPopover] = useState(false);
  const [inPopover, setInPopover] = useState(false);
  const buttonRef = useRef();

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

  const onKeyPress = evt => {
    evt.stopPropagation()
  }

  const onChange = value => {
    dispatch({
      type: 'setComment',
      id: id,
      comment: value
    })
  }

  const onFlagClick = () => {
    if (!flag) {
      setShowPopover(true);
    }

    dispatch({
      type: 'setFlag',
      id: id,
      flag: !flag
    })
  }

  const popoverContent = () => {
    return (
      <div className='popoverContent'>
        <AutoComplete 
          placeholder='Describe issue'
          value={ comment }
          onKeyPress={ onKeyPress } 
          onChange={ onChange }
          options={[
            { value: 'Option 1'},
            { value: 'Option 2'},
            { value: 'Option 3'}
          ]}
        />         
        <Button            
          type='text'
          shape='circle'
          icon={ <CheckOutlined /> } 
          onClick={ () => setShowPopover(false) } 
        />     
      </div>
/*      
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
*/      
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
          trigger='click' 
          visible={ showPopover }
        >
          <Button            
            type={ flag ? 'primary' : 'default' }
            shape='circle'
            icon={ <FlagOutlined /> } 
            onClick={ onFlagClick } 
          />
        </Popover>
      </div>
    </div>
  )
}