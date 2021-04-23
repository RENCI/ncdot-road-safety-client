import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Link, useHistory, useParams } from 'react-router-dom'
import { api } from '../../api'
import { Breadcrumb, Button, Tooltip, Typography } from 'antd'
import { ArrowRightOutlined, FastBackwardOutlined, StepBackwardOutlined, StepForwardOutlined, FastForwardOutlined } from '@ant-design/icons'
import { Scene } from '../../components/scene'

const { Paragraph, Title } = Typography

// context

const RouteBrowseContext = React.createContext({ })
const useRouteBrowseContext = () => useContext(RouteBrowseContext)

// components

const SceneMetaData = () => {
  const { currentLocation, imageIDs, index, routeID } = useRouteBrowseContext()
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '80%', opacity: 0.75 }}>
      <Paragraph style={{ textAlign: 'left' }}>
        { index + 1 } of { imageIDs.length }<br />
        Image ID: { imageIDs[index] || '...' } <br/>
        Route ID: { routeID || '...' } <br/>
      </Paragraph>
      <Paragraph style={{ textAlign: 'right' }}>
        Latitude: { currentLocation.lat || '...' }<br />
        Longitude: { currentLocation.long || '...' }<br />
      </Paragraph>
    </div>
  )
}

const Breadcrumbs = () => {
  const { index, routeID } = useRouteBrowseContext()
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link to="/routes">Routes</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to={ `/routes/${ routeID }` }>{ routeID }</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>{ index + 1 }</Breadcrumb.Item>
    </Breadcrumb>
  )
}

const BrowseButton = ({ url, tooltip, ...props }) => {
  const history = useHistory()
  if (!tooltip) {
    return <Button type="primary" onClick={ () => history.push(url) } { ...props } style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
  }
  return (
    <Tooltip placement="top" title={ tooltip }>
      <Button type="primary" onClick={ () => history.push(url) } { ...props } style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
    </Tooltip>
  )
}

BrowseButton.propTypes = {
  url: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
}

const RouteNavigation = () => {
  const { imageIDs, index, routeID } = useRouteBrowseContext()
  const tenNextIndex = useMemo(() => Math.min(imageIDs.length, index + 10), [index])
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
      <BrowseButton url={ `/routes/${ routeID }/${ tenNextIndex }` } disabled={ index + 10 > imageIDs.length } tooltip="Forward ten images">Forward 10 <FastForwardOutlined /></BrowseButton>
    </div>
  )
}

export const BrowseRouteView = (props) => {
  // grab parameters passed in from the route /routes/:routeID/:imageIndex
  // note that imageIndex is shifted by one for human readability
  const { routeID, imageIndex = 1 } = useParams()
  const [imageIDs, setImageIDs] = useState([])
  const [currentLocation, setCurrentLocation] = useState({})

  // index for current location along route.
  // first picture is index 1, ...
  // not starting at 0, as that may be confusing for some users seeing the URL
  const index = useMemo(() => {
    // if no imageIndex
    if (!imageIndex) { return 0 }

    // if no route or no images on route
    if (!routeID || imageIDs.length === 0) { return 0 }

    const i = parseInt(imageIndex) - 1

    // if index lies outside 0..(# of images - 1)
    if (i < 0 || imageIDs.length < i + 1) { return 0 }
    
    return i
  }, [imageIDs, imageIndex])

  console.log('- - -')
  console.log({ routeID })
  console.log({ imageIndex })
  console.log({ index })
  console.log({ currentLocation })

  // grab the image base names for all scenes along this route
  useEffect(() => {
    const fetchRouteImageBaseNames = async () => await api.getRouteInfo(routeID)
      .then(response => {
        if (response?.data?.route_image_base_names) {
          setImageIDs(response.data.route_image_base_names)
        }
      })
      .catch(error => console.error(error))
    fetchRouteImageBaseNames()
  }, [])

  // when scene/location changes,
  // update the document title with route & image info
  useEffect(() => { document.title = `Route ${ routeID }, #${ index + 1 } | RHF` }, [routeID, imageIndex])

  // when scene/location changes,
  // fetch metadata for the current location's scene
  useEffect(() => {
    console.log(routeID, imageIDs[index])
    const fetchSceneMetadata = async () => await api.getImageMetadata(imageIDs[index])
      .then(response => {
        const coordinates = { lat: response.data.metadata.lat, long: response.data.metadata.long }
        setCurrentLocation(coordinates)
      })
      .catch(error => console.error(error))
    if (imageIDs.length && index + 1) {
      fetchSceneMetadata()
    }
  }, [imageIDs, routeID, index])

  return (
    <RouteBrowseContext.Provider value={{ routeID, imageIDs, setImageIDs, index, imageIndex, currentLocation }}>
      <Title level={ 1 }>Route { routeID }</Title>

      <Breadcrumbs />
      
      <RouteNavigation />

      <SceneMetaData />
      
      <Scene id={ imageIDs[index] } />

      <Title level={ 4 }>image base names along this route</Title>
      
      <pre>
        { JSON.stringify(imageIDs, null, 2) }
      </pre>
      
      <Title level={ 4 }>current location</Title>
      
      <pre>
        { JSON.stringify(currentLocation, null, 2) }
      </pre>
      
    </RouteBrowseContext.Provider>
  )
}
