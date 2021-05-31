import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { api } from '../../api'
import { Col, Divider, Row, Typography } from 'antd'
import { Scene } from '../../components/scene'
import { Breadcrumbs } from '../../components/breadcrumbs'
import {
  RouteNavigation,
  PredictionsGraph,
  PredictionsList,
  SceneMetadata,
  ScenePrefetch,
  useRouteContext,
} from '../../components/route-browser'
import { Map } from '../../components/map'

const { Text, Title } = Typography

export const RouteBrowserView = () => {
  const { currentLocation, setCurrentLocation, imageIDs, imageIndex, index, routeID } = useRouteContext()

  // when scene/location changes,
  // fetch metadata for the current location's scene
  useEffect(() => {
    const fetchSceneMetadata = async () => await api.getImageMetadata(imageIDs[index])
      .then(response => {
        const coordinates = { lat: response.data.metadata.lat, long: response.data.metadata.long }
        setCurrentLocation({ id: imageIDs[index], ...coordinates })
      })
      .catch(error => console.error(error))
    if (imageIDs.length && index + 1) {
      fetchSceneMetadata()
    }
  }, [imageIDs, routeID, index])

  return (
    <Fragment>
      <Breadcrumbs crumbs={[
        { text: 'Home', path: '/' },
        { text: 'Routes', path: `/routes` },
        { text: routeID, path: `/routes/${ routeID }` },
        { text: index + 1, path: `/routes/${ routeID }/${ imageIndex }` },
      ]} />

      <Divider />

      <PredictionsGraph />
      <RouteNavigation />

      <br />

      <Scene id={ imageIDs[index] } />
      <SceneMetadata />

      <Divider />

      <Row gutter={ 32 }>
        <Col md={ 24 } lg={ 18 }>
          <Map markers={ [currentLocation] } height="400px" zoom={ 13 } />
          <br />
        </Col>
        <Col md={ 24 } lg={ 6 }>
          <Title level={ 3 }>Feature Predictions</Title>
          <PredictionsList key={ currentLocation.id } />
        </Col>
      </Row>

      { // scene back ten steps 
        0 < imageIDs.length && 0 < index - 9 && <ScenePrefetch id={ imageIDs[index - 10] } /> }
      { // prev scene
        0 < imageIDs.length && 0 <= index - 1 && <ScenePrefetch id={ imageIDs[index - 1] } /> }
      { // next scene
        0 < imageIDs.length && index + 1 < imageIDs.length && <ScenePrefetch id={ imageIDs[index + 1] } /> }
      { // scene forward ten steps 
        0 < imageIDs.length && index + 10 < imageIDs.length && <ScenePrefetch id={ imageIDs[index + 10] } /> }
    </Fragment>
  )
}
