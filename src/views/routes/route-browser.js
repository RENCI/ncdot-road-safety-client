import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { api } from '../../api'
import { Button, Card, Col, Divider, Row, Typography } from 'antd'
import {
  AreaChartOutlined as SummaryIcon,
  CarOutlined as CarIcon,
} from '@ant-design/icons'
import { Scene } from '../../components/scene'
import { Breadcrumbs } from '../../components/breadcrumbs'
import {
  PredictionsScatterplot,
  PredictionsList,
  RouteNavigation,
  SceneMetadata,
  ScenePrefetch,
  useRouteContext,
} from '../../components/route-browser'
import { Map } from '../../components/map'

const { Text, Title } = Typography

export const RouteBrowserView = () => {
  const history = useHistory()
  const { currentLocation, images, imageIndex, index, routeID } = useRouteContext()
  const [startingCoordinates, setStartingCoordinates] = useState()
  const [endingCoordinates, setEndingCoordinates] = useState()
  const [pathCoordinates, setPathCoordinates] = useState([])

  useEffect(() => {
    if (!routeID || !images.length) {
      return
    }
    setPathCoordinates(images.map(({ location }) => location))
    setStartingCoordinates({ ...images[0].location })
    setEndingCoordinates({ ...images.slice(-1)[0].location })
  }, [images, routeID])

  if (!currentLocation) {
    return 'Loading...'
  }

  return (
    <Fragment>
      <Breadcrumbs crumbs={[
        { text: 'Home', path: '/' },
        { text: 'Routes', path: `/routes` },
        { text: `${ routeID }`, path: `/routes/${ routeID }` },
        { text: imageIndex, path: `/routes/${ routeID }/${ imageIndex }` },
      ]} />

      <Divider />

      <div className="route-views-actions">
        <Button type="primary" ghost onClick={ () => history.push(`/routes/${ routeID }/`) } className="route-action-button" icon={ <SummaryIcon /> }>View Route Summary</Button>
      </div>

      <PredictionsScatterplot canZoom={ true } />
      <RouteNavigation />

      <br />

      <Scene id={ images[index]?.image_base_name } />
      <SceneMetadata />

      <Divider />

      <Row gutter={ 32 }>
        <Col md={ 24 } lg={ 18 }>
          <Map
            height="400px"
            zoom={ 13 }
            markers={ [currentLocation.location] }
            path={ pathCoordinates }
          />
          <br />
        </Col>
        <Col md={ 24 } lg={ 6 }>
          <Card className="scene-feature-predictions">
            <Title level={ 3 }>Feature Predictions</Title>
            <PredictionsList features={ currentLocation.features } />
          </Card>
        </Col>
      </Row>

      { // scene back ten steps 
        0 < images.length && 0 < index - 9 && <ScenePrefetch id={ images[index - 10].image_base_name } /> }
      { // prev scene
        0 < images.length && 0 <= index - 1 && <ScenePrefetch id={ images[index - 1].image_base_name } /> }
      { // next scene
        0 < images.length && index + 1 < images.length && <ScenePrefetch id={ images[index + 1].image_base_name } /> }
      { // scene forward ten steps 
        0 < images.length && index + 10 < images.length && <ScenePrefetch id={ images[index + 10].image_base_name } /> }
    </Fragment>
  )
}
