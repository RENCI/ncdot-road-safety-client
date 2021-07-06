import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Col, Row, Space, Typography } from 'antd'
import { api } from '../../api'
import { Map } from '../map'
import { Spin } from 'antd'
import {
  CarOutlined as DriveIcon,
  InfoCircleOutlined as SummaryIcon,
} from '@ant-design/icons'

import './expansion-panel.css'

const { Paragraph, Text, Title } = Typography

export const ExpansionPanel = ({ data: route }) => {
  const history = useHistory()
  const [images, setImages] = useState([])
  const [loadingMap, setLoadingMap] = useState(true)
  const [mapZoom, setMapZoom] = useState()
  const [startingCoordinates, setStartingCoordinates] = useState({ lat: 0, long: 0 })
  const [endingCoordinates, setEndingCoordinates] = useState({ lat: 0, long: 0 })
  const [pathCoordinates, setPathCoordinates] = useState([])

  useEffect(() => {
    const fetchRouteImages = async () => await api.getRouteInfo(route.id)
      .then(response => {
        setImages(response.data.route_image_info)
      })
      .catch(error => console.error(error))
    fetchRouteImages()
  }, [])

  useEffect(() => {
    if (!images.length) { return }
    const path = images.map(({ location }) => location)
    setPathCoordinates(path)
    setStartingCoordinates(path[0])
    setEndingCoordinates(path.slice(-1)[0])
  }, [images])

  return (
    <article className="expansion-panel">
      <Row>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <div className="route-details">
            <Paragraph strong copyable>
              { route.id }
            </Paragraph>

            <Paragraph>
              { images.length } image{ images.length !== 1 ? 's' : '' } along this route
            </Paragraph>

            <Paragraph>
              <Text style={{ color: 'var(--color-positive)' }}>&nbsp;<strong>&#x2b;</strong>&nbsp; Start</Text>: { startingCoordinates.long } longitude, { startingCoordinates.lat } latitude<br />
              <Text style={{ color: 'var(--color-negative)' }}>&nbsp;<strong>&times;</strong>&nbsp; End</Text>: { endingCoordinates.long } longitude, { endingCoordinates.lat } latitude
            </Paragraph>

            <Space direction="vertical" size="large">
              <Button type="default" onClick={ () => history.push(`/routes/${ route.id }`) } className="route-action-button"><SummaryIcon /> Route Summary</Button>
              <Button type="default" onClick={ () => history.push(`/routes/${ route.id }/1`) } className="route-action-button"><DriveIcon /> Drive Route</Button>
            </Space>

          </div>
        </Col>
        <Col xs={{ span: 0 }} lg={{ span: 12 }}>
          <Map
            markers={ [startingCoordinates, endingCoordinates] }
            path={ pathCoordinates }
            zoom={ 13 }
            basemapSelection={ false }
          />
        </Col>
      </Row>
    </article>
  )
}
