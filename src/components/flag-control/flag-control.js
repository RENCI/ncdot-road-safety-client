import React from 'react'
import { Popover, Button, AutoComplete } from 'antd'
import { FlagOutlined } from '@ant-design/icons'
import './flag-control.css'

export const FlagControl = ({ flag, comment, options, onFlagChange, onCommentChange }) => {
  const onFlagClick = () => {     
    onFlagChange(!flag)
  }

  const onKeyPress = evt => {
    evt.stopPropagation()
  }

  const popoverContent = () => {
    return (
      <div onKeyPress={ onKeyPress }>
        <AutoComplete 
          placeholder='Describe issue'
          value={ comment }
          style={{ width: 200 }}
          onSelect={ onCommentChange }
          onChange={ onCommentChange }
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
  )
}