import React, { useContext } from 'react'
import { Popover, Button, AutoComplete } from 'antd'
import { FlagOutlined } from '@ant-design/icons'
import { AnnotationBrowserContext } from '../../contexts'
import { Scene } from '../scene'
import { FlagControl } from '../flag-control'
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

  const onFlagChange = value => {     
    dispatch({
      type: 'setFlag',
      id: id,
      flag: value
    })
  }

  const onCommentChange = value => {
    dispatch({
      type: 'setComment',
      id: id,
      comment: value
    })
  }

  return (    
    <div className='annotationPanel'>
      <Scene 
        id={ id } 
        present={ present } 
        handleClick={ handleImageClick } />
      <div className='flagControl' >
        <FlagControl        
          flag={ flag }
          comment={ comment }
          options={ ['Option 1', 'Option 2', 'Option 3'] }
          onFlagChange={ onFlagChange }
          onCommentChange={ onCommentChange }
        />
      </div>
    </div>
  )
}