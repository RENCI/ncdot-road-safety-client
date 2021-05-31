import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { api } from '../../api'
import { Col, Divider, Row, Space, Typography } from 'antd'
import { Scene } from '../../components/scene'
import { Breadcrumbs } from '../../components/breadcrumbs'
import {
  RouteNavigation,
  PredictionsGraph,
  PredictionsList,
  RouteBrowser,
  SceneMetadata,
  ScenePrefetch,
} from '../../components/route-browser'
import { Map } from '../../components/map'
const { Text, Title } = Typography

export const BrowseRouteView = () => {
  // grab parameters passed in from the route /routes/:routeID/:imageIndex
  // note that imageIndex is shifted by one for human readability
  const { routeID, imageIndex } = useParams()
  const [imageIDs, setImageIDs] = useState([])
  const [currentLocation, setCurrentLocation] = useState({})
  const [index, setIndex] = useState(0)

  useEffect(() => {
    // use index 0...
    // ...if no imageIndex
    if (!imageIndex) { setIndex(-1); return; }
    // ...if no route or no images on route
    if (!routeID || imageIDs.length === 0) { setIndex(-1); return; }
    const i = parseInt(imageIndex) - 1
    // ...if index lies outside 0..(# of images - 1)
    if (i < 0 || imageIDs.length < i + 1) { setIndex(-1); return; }
    // ok, let's go
    setIndex(i)
  }, [imageIndex, imageIDs.length])

  // grab the image base names for all scenes along this route
  useEffect(() => {
    const fetchRouteImageBaseNames = async () => await api.getRouteInfo(routeID)
      .then(response => {
        setImageIDs(response.data.route_image_info.map(item => item.image_base_name))
      })
      .catch(error => console.error(error))
    fetchRouteImageBaseNames()
  }, [routeID])

  // when scene/location changes,
  // update the document title with route & image info
  useEffect(() => { document.title = `Route ${ routeID }, #${ index + 1 } | RHF` }, [routeID, index])

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
    <RouteBrowser value={{ routeID, imageIDs, index, imageIndex, currentLocation }}>
      <Title level={ 1 }>Route { routeID }</Title>

      {
        index === -1 ? (
          <Fragment>
            <Breadcrumbs crumbs={[
              { text: 'Home', path: '/' },
              { text: 'Routes', path: `/routes` },
              { text: routeID, path: `/routes/${ routeID }` },
            ]} />

            <Divider />

            <Link to={ `/routes/${ routeID }/1` }>Browse this Route</Link>

            <Text>{ imageIDs.length } images</Text>
          </Fragment>
        ) : (
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
                <Title level={ 2 }>Feature Predictions</Title>
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


    </RouteBrowser>
  )
}

const RouteOverview = () => {
  return (
    <div>
      Route 
    </div>
  )
}
