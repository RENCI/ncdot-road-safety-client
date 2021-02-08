import React, { useState } from 'react'
import { Popover, Button, Select, AutoComplete } from 'antd'
import { FlagOutlined } from '@ant-design/icons'
import './flag-control.css'

const { Option } = Select;

export const FlagControl = ({ flag, comment, options, onFlagChange, onCommentChange }) => {

  const [flags, setFlags] = useState([])

  const onFlagClick = () => {     
    onFlagChange(!flag)
  }

  const onKeyPress = evt => {
    evt.stopPropagation()
  }

  const onChange = value => {
    console.log(value)

    setFlags(value)
  }

  const popoverContent = () => {
    return (
      <div onKeyPress={ onKeyPress }>
        <Select 
          mode='tags'
          placeholder='Add comments'
          value={ flags }
          style={{ width: 200 }}
          onChange={ onChange }
        >
          { options.map((option, i) => (
            <Option key={ i } value={ option }>{ option }</Option>
          ))}
        </Select>
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