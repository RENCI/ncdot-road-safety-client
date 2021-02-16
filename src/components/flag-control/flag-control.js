import React, { useState } from 'react'
import { Popover, Button, Input } from 'antd'
import { FlagOutlined, UserOutlined } from '@ant-design/icons'
import './flag-control.css'

export const FlagControl = ({ flags, options, userOptions, onFlagChange, onPopoverVisibleChange }) => {
  const [newFlag, setNewFlag] = useState('')

  const onKeyPress = evt => {
    evt.stopPropagation()
  }

  const onFlagClick = flag => {
    if (flags.includes(flag)) {
      onFlagChange(flags.filter(currentFlag => currentFlag !== flag))
    }
    else {
      onFlagChange(flags.concat(flag))
    }
  }

  const onInputChange = evt => {
    setNewFlag(evt.target.value)
  }

  const onInputPressEnter = evt => {
    const flag = evt.target.value

    if (flag === '') return

    if (!flags.includes(flag)) {
      onFlagChange(flags.concat(flag))
    }    

    setNewFlag('')
  }

  const popoverContent = () => {
    return (
      <div 
        className='flags'
        onKeyPress={ onKeyPress }
      >
        { options.map((option, i) => (
          <Button 
            key={ i }
            className='mb-2'
            type={ flags.includes(option) ? 'primary' : 'default' }
            shape='round'
            size='small'
            onClick={ () => onFlagClick(option) }
          >
            <u>{ option[0] }</u>{ option.slice(1) }
          </Button>
        ))}      
        { userOptions.map((option, i) => (
          <Button
            key={ 'user_' + i }
            className='mb-2'
            type={ flags.includes(option) ? 'primary' : 'default' }
            shape='round'
            size='small'
            onClick={ () => onFlagClick(option) }
          >
            <div className='userOption'>
              <UserOutlined />
              { option }
            </div>
          </Button>
        ))}
        <Input 
          placeholder='Add new flag' 
          value={ newFlag }
          size='small'
          onChange= { onInputChange }
          onPressEnter={ onInputPressEnter }
        />
      </div>      
    )
  }

  const hasFlags = flags.length > 0;

  return (    
    <div className='flagButton' >
      <Popover
        title='Flag image'
        content={ popoverContent } 
        placement='right'
        trigger='click'
        onVisibleChange={ onPopoverVisibleChange }
      >
        <Button 
          type={ hasFlags ? 'primary' : 'default' } 
          ghost={ hasFlags }
        >
          <div>
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