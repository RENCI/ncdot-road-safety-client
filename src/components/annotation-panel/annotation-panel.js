import React, { useContext } from 'react'
import { Popover, Button, AutoComplete } from 'antd'
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

  const onFlagClick = () => {     
    dispatch({
      type: 'setFlag',
      id: id,
      flag: !flag
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
  }

  const onChange = value => {
    dispatch({
      type: 'setComment',
      id: id,
      comment: value
    })
  }

  const popoverContent = () => {
    return (
      <div onKeyPress={ onKeyPress }>
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
        { flag ?
          <Popover
            content={ popoverContent } 
            placement='topRight'
            trigger='hover' 
            defaultVisible={ true }
          >
            <Button            
              type={ 'primary' }
              shape='circle'
              icon={ <FlagOutlined /> } 
              onClick={ onFlagClick } 
            />
          </Popover>
          :
          <Button            
            type={ 'default' }
            shape='circle'
            icon={ <FlagOutlined /> } 
            onClick={ onFlagClick } 
          />
        }
      </div>
    </div>
  )
}