import React from 'react'
import { Popover, Button, Select } from 'antd'
import { FlagOutlined, UserOutlined } from '@ant-design/icons'
import './flag-control.css'

const { Option } = Select;

export const FlagControl = ({ flags, options, userOptions, onFlagChange, onPopoverVisibleChange }) => {
  const onKeyPress = evt => {
    evt.stopPropagation()
  }

  const onChange = flags => {
    onFlagChange(flags)
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
            <Option key={ i } value={ option }>
              { option }
            </Option>
          ))}
          { userOptions.map((option, i) => (
            <Option key={ "user_" + i } value={ option }>
              <div className='userOption'>
                <UserOutlined />
                { option }
              </div>
            </Option>
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
        onVisibleChange={ onPopoverVisibleChange }
      >
        <Button 
          type={ hasFlags ? 'primary' : 'default' } 
          ghost={ hasFlags }
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