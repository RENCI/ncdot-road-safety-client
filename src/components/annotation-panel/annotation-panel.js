import React, { useContext, useState, useRef } from 'react'
import { Popover, Button, Switch, Input, AutoComplete } from 'antd'
import { FlagOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
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

  const onSelect = value => {
    dispatch({
      type: 'setComment',
      id: id,
      comment: value
    })

    setShowPopover(false)
  }

  const onChange = value => {
    dispatch({
      type: 'setComment',
      id: id,
      comment: value
    })
  }

  const onFlagClick = () => {      
    setShowPopover(!showPopover);

    if (!flag) {
      dispatch({
        type: 'setFlag',
        id: id,
        flag: true
      })
    }
  }

  const onCheckClick = () => {
    setShowPopover(false)
  }

  const onCancelClick = () => {
    dispatch({
      type: 'setFlag',
      id: id,
      flag: false
    })

    setShowPopover(false)
  }

  const popoverContent = () => {
    return (
      <Input.Group compact >
        <AutoComplete 
          placeholder='Describe issue'
          value={ comment }
          style={{ width: 200 }}
          onKeyPress={ onKeyPress }
          onSelect={ onSelect }
          onChange={ onChange }
          options={[
            { value: 'Option 1'},
            { value: 'Option 2'},
            { value: 'Option 3'}
          ]}
        />         
        <Button      
          disabled= { comment === "" }
          icon={ <CheckOutlined /> } 
          onClick={ onCheckClick } 
        />    
        <Button      
          icon={ <CloseOutlined /> } 
          onClick={ onCancelClick } 
        />  
      </Input.Group>
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