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

const markerStyles = {
  start: { color: 'teal', style: 'cross' },
  end: { color: 'tomato', style: 'x' },
}

export const ExpansionPanel = ({ data: route }) => {
  const history = useHistory()
  const [images, setImages] = useState([])
  const [startingCoordinates, setStartingCoordinates] = useState({ lat: 0, long: 0 })
  const [endingCoordinates, setEndingCoordinates] = useState({ lat: 0, long: 0 })
  const [markers, setMarkers] = useState([])
  const [loadingMap, setLoadingMap] = useState(true)
  const [mapZoom, setMapZoom] = useState()

  useEffect(() => {
    const fetchRouteImageBaseNames = async () => await api.getRoutePredictionInfo(route.id, 'guardrail')
      .then(response => {
        setImages(response.data.route_image_info)
      })
      .catch(error => console.error(error))
    fetchRouteImageBaseNames()
  }, [])

  useEffect(() => {
    if (!images.length) { return }

    const constructMapMarkers = async () => {
      try {
        const firstImageBaseName = images[0].image_base_name
        const lastImageBaseName = images.slice(-1)[0].image_base_name
        const response = await Promise.all([
          api.getImageMetadata(firstImageBaseName),
          api.getImageMetadata(lastImageBaseName),
        ])
        const [start, end] = response.map(res => res.data.metadata)
        setStartingCoordinates({ long: start.long.toFixed(6), lat: start.lat.toFixed(6), ...markerStyles.start })
        setEndingCoordinates({ long: end.long.toFixed(6), lat: end.lat.toFixed(6), ...markerStyles.end })
        setLoadingMap(false)
      } catch (error) {
        console.log(error)
      }
    }
    constructMapMarkers()
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
              <Text style={{ color: 'teal' }}>&nbsp;<strong>&#x2b;</strong>&nbsp; Start</Text>: { startingCoordinates.long } longitude, { startingCoordinates.lat } latitude<br />
              <Text style={{ color: 'tomato' }}>&nbsp;<strong>&times;</strong>&nbsp; End</Text>: { endingCoordinates.long } longitude, { endingCoordinates.lat } latitude
            </Paragraph>

            <Space direction="vertical" size="large">
              <Button type="default" onClick={ () => history.push(`/routes/${ route.id }`) } className="route-action-button"><SummaryIcon /> Route Summary</Button>
              <Button type="default" onClick={ () => history.push(`/routes/${ route.id }/1`) } className="route-action-button"><DriveIcon /> Drive Route</Button>
            </Space>

          </div>
        </Col>
        <Col xs={{ span: 0 }} lg={{ span: 12 }}>
          <Map markers={ [startingCoordinates, endingCoordinates] } basemapSelection={ false } />
        </Col>
      </Row>
    </article>
  )
}
