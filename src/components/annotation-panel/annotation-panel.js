import React, { useState } from 'react'
import { Modal, Button, Tooltip, Switch, Input, Form, Typography } from 'antd'
import { FlagOutlined } from '@ant-design/icons'
import { Scene } from '../scene'
import './annotation-panel.css'

const { Text } = Typography;

export const AnnotationPanel = ({ image, handleClick }) => {
  const [flagDialogOpen, setFlagDialogOpen] = useState(false)
  const [flag, setFlag] = useState(false)

  const onFlagClick = () => {
    setFlagDialogOpen(!flagDialogOpen)
  }

  const onFlagDialogOk = () => {
    setFlag(true)
    setFlagDialogOpen(false)
  }

  const onFlagDialogCancel = () => {
    setFlagDialogOpen(false)
  }

  return (    
    <div className='annotationPanel'>
      <Scene 
        id={ image.id } 
        present={ image.present } 
        handleClick={ handleClick } />
      <div className='flagButton'>
        <Tooltip title='Flag image'>
          <Button
            type={ flag ? 'primary' : 'default' }
            shape='circle'
            icon={ <FlagOutlined /> }
            disabled={ flagDialogOpen }
            onClick={ onFlagClick } />
          <Modal title='Flag image'
            visible={ flagDialogOpen }
            onOk={ onFlagDialogOk }
            onCancel={ onFlagDialogCancel }
          >
            <Form>        
              <Form.Item label="Flag image">
                <Switch />
              </Form.Item>
              <Form.Item>
                <Input placeholder="Description, e.g. Left view guardrail barely visible" />
              </Form.Item>
            </Form>  
          </Modal>
        </Tooltip>
      </div>
    </div>
  )
}