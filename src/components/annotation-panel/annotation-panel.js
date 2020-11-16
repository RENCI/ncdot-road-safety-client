import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Space, Button, Tooltip } from 'antd'
import { FundViewOutlined } from '@ant-design/icons'
import { Scene } from '../scene'
import { ImageContext } from '../../contexts'
import './annotation-panel.css'

export const AnnotationPanel = ({ image, handleClick }) => {
  const [, imageDispatch] = useContext(ImageContext)
  const history = useHistory()

  const handleRouteClick = () => {
    imageDispatch({
      type: 'setImage', 
      id: image.id,
      annotations: image.annotations,
      metadata: image.metadata
    })

    history.push('/browse/route')
  }

  return (    
    <Space direction='horizontal'>
      <Scene 
        id={ image.id } 
        present={ image.present } 
        handleClick={ handleClick } />
      <div className='routeButton'>
        <Tooltip title='Browse by route'>
          <Button 
            shape='circle' 
            icon={ <FundViewOutlined /> } 
            onClick={ handleRouteClick } />
        </Tooltip>
      </div>
    </Space>
  )
}