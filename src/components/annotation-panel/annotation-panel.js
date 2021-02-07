import React, { useContext, useState } from 'react'
import { Popover, Button, Input, AutoComplete } from 'antd'
import { FlagOutlined, CheckOutlined } from '@ant-design/icons'
import { AnnotationBrowserContext } from '../../contexts'
import { Scene } from '../scene'
import './annotation-panel.css'

export const AnnotationPanel = ({ image }) => {
  const [, dispatch] = useContext(AnnotationBrowserContext)
  const [showPopover, setShowPopover] = useState(false);

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

  const onFlagClick = () => {      
    setShowPopover(!flag);

    dispatch({
      type: 'setFlag',
      id: id,
      flag: !flag
    })
  }

  const onKeyPress = evt => {
    evt.stopPropagation()

    if (evt.key === 'Enter') {
      setShowPopover(false)
    }
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

  const onCheckClick = () => {
    setShowPopover(false)
  }

  const popoverContent = () => {
    return (
      <div onKeyPress={ onKeyPress }>
        <Input.Group 
          compact 
        >
          <AutoComplete 
            placeholder='Describe issue'
            value={ comment }
            style={{ width: 200 }}
            onSelect={ onSelect }
            onChange={ onChange }
            options={[
              { value: 'Option 1'},
              { value: 'Option 2'},
              { value: 'Option 3'}
            ]}
          />         
          <Button      
            icon={ <CheckOutlined /> } 
            onClick={ onCheckClick } 
          />  
        </Input.Group>
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