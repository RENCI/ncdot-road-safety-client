import React, { useState } from 'react'
import { Tooltip, Popover, Button, Input } from 'antd'
import { FlagOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons'
import './flag-control.css'

export const FlagControl = ({ 
  flags, options, userOptions, shortcuts, tooltip, onFlagChange, onPopoverVisibleChange, onRemoveUserFlagOption
}) => {
  const [newFlag, setNewFlag] = useState('')

  const onInputChange = evt => {
    setNewFlag(evt.target.value)
  }

  const onInputPressEnter = evt => {
    const flag = evt.target.value

    if (flag === '') return

    onFlagChange(flag)

    setNewFlag('')
  }

  const popoverContent = () => {
    const optionDisplay = (option, i, isUserOption) => {
      const shortcut = shortcuts[option]
      const j = shortcut ? shortcut.index : 0

      const display = shortcut ? 
        <span className='shortcutOption'>
          { option.slice(0, j) }
          <u>{ option[j] }</u>
          { option.slice(j + 1) }
        </span> 
        : option

      return (
        <div 
          key={ isUserOption ? 'user_' + i : i }
          className='alignVertical mb-2'
        >
          <Button 
            type={ flags.includes(option) ? 'primary' : 'default' }
            shape='round'
            size='small'
            onClick={ () => onFlagChange(option) }
          >
            { isUserOption ? 
              <div className='alignVertical'>
                <UserOutlined className='userIcon' />
                { display }
              </div>
            : display
            }
          </Button>
          { isUserOption && 
            <Button
              type='text'
              size='small'
              onClick={ () => onRemoveUserFlagOption(option) }
            >
              <div className='alignVertical'>
                <CloseOutlined />
              </div>
            </Button>
          }
        </div>
      )
    }

    return (
      <div className='flags'>
        { options.map((option, i) => optionDisplay(option, i, false)) }      
        { userOptions.map((option, i) => optionDisplay(option, i, true)) }
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

  const tooltipText = text => (
    text ?
      <>
        { text.substr(0, text.indexOf(' ')) }
        <strong>{ text.substr(text.indexOf(' ')) }</strong>
      </>
    : null
  )

  return (    
    <div className='flagButton' >
      <Tooltip 
        title={ tooltipText(tooltip) }
        visible={ tooltip !== null }
        placement='right'
        color={ tooltip && tooltip.includes('Added') ? 'blue' : null }
      >
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
      </Tooltip>
    </div>
  )
}