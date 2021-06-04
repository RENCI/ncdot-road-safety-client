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
  const { currentLocation, setCurrentLocation, images, imageIndex, index, routeID } = useRouteContext()

  // when scene/location changes,
  // fetch metadata for the current location's scene
  useEffect(() => {
    const fetchSceneMetadata = async () => await api.getImageMetadata(images[index].image_base_name)
      .then(response => {
        const coordinates = { lat: response.data.metadata.lat, long: response.data.metadata.long }
        setCurrentLocation({ id: images[index].image_base_name, distance: images[index].mile_post, ...coordinates })
      })
      .catch(error => console.error(error))
    if (images.length && index + 1) {
      fetchSceneMetadata()
    }
  }, [images, routeID, index])

  return (
    <Fragment>
      <Breadcrumbs crumbs={[
        { text: 'Home', path: '/' },
        { text: 'Routes', path: `/routes` },
        { text: `${ routeID }`, path: `/routes/${ routeID }` },
        { text: `${ index + 1 }`, path: `/routes/${ routeID }/${ imageIndex }` },
      ]} />

      <Divider />

      <PredictionsGraph />
      <RouteNavigation />

      <br />

      <Scene id={ images[index]?.image_base_name } />
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
