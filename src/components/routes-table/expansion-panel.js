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
  const [imageIDs, setImageIDs] = useState([])
  const [startingCoordinates, setStartingCoordinates] = useState({ lat: 0, long: 0 })
  const [endingCoordinates, setEndingCoordinates] = useState({ lat: 0, long: 0 })
  const [markers, setMarkers] = useState([])
  const [loadingMap, setLoadingMap] = useState(true)
  const [mapZoom, setMapZoom] = useState()

  useEffect(() => {
    const fetchRouteImageBaseNames = async () => await api.getRouteInfo(route.id)
      .then(response => {
        setImageIDs(response.data.route_image_info.map(item => item.image_base_name))
      })
      .catch(error => console.error(error))
    fetchRouteImageBaseNames()
  }, [])

  useEffect(() => {
    if (!imageIDs.length) { return }

    const constructMapMarkers = async () => {
      try {
        const response = await Promise.all([
          api.getImageMetadata(imageIDs[0]), // first route image
          api.getImageMetadata(imageIDs.slice(-1)) // last route image
        ])
        const [start, end] = response.map(res => res.data.metadata)
        setStartingCoordinates({ long: start.long, lat: start.lat, ...markerStyles.start })
        setEndingCoordinates({ long: end.long, lat: end.lat, ...markerStyles.end })
        setLoadingMap(false)
      } catch (error) {
        console.log(error)
      }
    }
    constructMapMarkers()
  }, [imageIDs])

  return (
    <article className="expansion-panel">
      <Row>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <div className="route-details">
            <Paragraph strong copyable>
              { route.id }
            </Paragraph>

            <Paragraph>
              { imageIDs.length } image{ imageIDs.length !== 1 ? 's' : '' } along this route
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
