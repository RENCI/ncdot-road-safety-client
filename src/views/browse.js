import React from 'react'
import { Typography, Row, Col } from 'antd'
import { ImageBrowser } from '../components/image-viewer'
import { AnnotationControls } from '../components/annotation-controls'
import { MapView } from '../components/map-view'

const { Title } = Typography

export const BrowseView = () => {
  return (
    <>
      <Title level={ 1 }>Browse</Title>

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
          <MapView height={ 300 } />
        </Col>
      </Row>
    </>
  )
}
