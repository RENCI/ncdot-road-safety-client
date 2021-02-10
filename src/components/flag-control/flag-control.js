import React, { useState } from 'react'
import { Popover, Button, Select } from 'antd'
import { FlagOutlined } from '@ant-design/icons'
import './flag-control.css'

const { Option } = Select;

export const FlagControl = ({ flag, comment, options, onFlagChange, onCommentChange }) => {
  const [flags, setFlags] = useState([])

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
          style={{ width: 300 }}
          onChange={ onChange }
        >
          { options.map((option, i) => (
            <Option key={ i } value={ option }>{ option }</Option>
          ))}
        </Select>
      </div>      
    )
  }

  const hasFlags = flags.length > 0;

  return (    
    <div className='flagButton' >
      <Popover
        title='Add / remove flags'
        content={ popoverContent } 
        placement='right'
        trigger='click'
      >
        <Button 
          type={ hasFlags ? 'primary' : 'default' } 
          ghost={ hasFlags }
          size='large'
        >
          <div style={{ display: "flex", flexDirection: "column"}}>
            <FlagOutlined />
            <div style={{ visibility: !hasFlags ? 'hidden' : null }}>
              { flags.length }
            </div>
          </div>
        </Button>
      </Popover>
    </div>
  )
}