import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { api } from '../../api'
import { Typography } from 'antd'
import { Scene } from '../../components/scene'
import { Breadcrumbs,NavigationButtons, NavigationSlider, RouteBrowser, SceneMetadata, ScenePrefetch } from '../../components/route-browser'

const { Title } = Typography

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
    if (!imageIndex) { setIndex(0); return; }
    // ...if no route or no images on route
    if (!routeID || imageIDs.length === 0) { setIndex(0); return; }
    const i = parseInt(imageIndex) - 1
    // ...if index lies outside 0..(# of images - 1)
    if (i < 0 || imageIDs.length < i + 1) { setIndex(0); return; }
    // ok, let's go
    setIndex(i)
  }, [imageIndex, imageIDs.length])

  // grab the image base names for all scenes along this route
  useEffect(() => {
    const fetchRouteImageBaseNames = async () => await api.getRouteInfo(routeID)
      .then(response => {
        setImageIDs(response?.data?.route_image_base_names)
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

      <Breadcrumbs />

      <br /><hr /><br />

      <NavigationButtons />
      
      <br />

      <NavigationSlider />

      <br />

      <SceneMetadata />
      <Scene id={ imageIDs[index] } />

      <br /><hr /><br />

      { // prev scene
        imageIDs.length > 0 && 0 <= index - 1 && <ScenePrefetch id={ imageIDs[index - 1] } /> }
      { // next scene
        imageIDs.length > 0 && index + 1 < imageIDs.length && <ScenePrefetch id={ imageIDs[index + 1] } /> }
    </RouteBrowser>
  )
}
