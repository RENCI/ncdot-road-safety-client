import React from 'react'
import { Row, Col } from 'antd'
import { ImageBrowser } from '../image-viewer'
import { AnnotationControls } from '../annotation-controls'
import { MapViewer } from '../map-viewer'

export const RouteBrowser = () => {
  return (
    <>
      <Row>
        <Col span={ 24 }>
          <ImageBrowser />
        </Col>
      </Row>

      <br />

      <Row gutter={ 16  }>
        <Col span={ 12 }>
          <AnnotationControls />
        </Col>
        <Col span={ 12 }>
          <MapViewer height={ 300 } />
        </Col>
      </Row>
    </>
  )
}
