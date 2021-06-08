import React from 'react'
import { Row, Col } from 'antd'
import { NavigationButtons } from './navigation-buttons'
import { NavigationSlider } from './navigation-slider'
import './navigation.css'

export const RouteNavigation = () => {
  return (
    <Row className="route-controls" gutter={ 32 }>
      <Col xs={ 24 } lg={ 18 }>
        <NavigationSlider />
      </Col>
      <Col xs={ 24 } lg={ 6 }>
        <NavigationButtons />
      </Col>
    </Row>
  )
}
