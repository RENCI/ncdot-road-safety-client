import React, { useEffect, useState } from 'react'
import { Button, Row, Col } from 'antd'
import { LeftOutlined as PreviousIcon, RightOutlined as NextIcon } from '@ant-design/icons'
import { AnnotationControls } from '../annotation-controls'
import { MapView } from '../map-view'
import './image-browser.css'
import { Scene } from '../scene'

const someTimeStamps = [
  '10000174727',
  '10000174808',
  '10000174819',
  '10000174829',
  '10000174909',
  '10000174920',
  '10000174920',
  '10000175011',
  '10000175022',
  '10000175103',
]

export const ImageBrowser = ({ images }) => {
  const [index, setIndex] = useState(0)

  const handleClickPrevious = () => {
    setIndex(index => Math.max(0, index - 1))
  }

  const handleClickNext = () => {
    setIndex(index => Math.min(index + 1, images.length - 1))
  }

  return (
    <div className="image-viewer">
      
      <div className="image-actions">
        <Button type="primary" onClick={ handleClickPrevious } disabled={ index === 0 }><PreviousIcon /></Button>
        <Button type="primary" onClick={ handleClickNext } disabled={ index === images.length - 1 }><NextIcon /></Button>
      </div>

      <br />

      <Scene timestamp={ someTimeStamps[index] } />

      <Row gutter={ 16 }>
        <Col span={ 12 }>
          <AnnotationControls />
        </Col>
        <Col span={ 12 }>
          <MapView height={ 300 } />
        </Col>
      </Row>
    </div>
  )
}