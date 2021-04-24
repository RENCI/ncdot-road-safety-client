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
  
  console.log(url)

  if (!tooltip) {
    return (
      <Button type="primary" onClick={ () => history.push(url) } { ...props } style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
    )
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

export const BrowseRouteView = () => {
  const history = useHistory()
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

    console.log(imageIndex)
    console.log(i)
    setIndex(i)
  }, [imageIndex, imageIDs.length])

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
  }, [routeID])

  // when scene/location changes,
  // update the document title with route & image info
  useEffect(() => { document.title = `Route ${ routeID }, #${ index + 1 } | RHF` }, [routeID, index])

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

  const MemoizedScene = useMemo(() => <div>index: { index }<br/><Scene id={ imageIDs[index] } /></div>, [imageIDs, index])

  return (
    <RouteBrowseContext.Provider value={{ routeID, imageIDs, index, imageIndex, currentLocation }}>
      <Title level={ 1 }>Route { routeID }</Title>

      <Breadcrumbs />
      
      <button onClick={ () => history.push(`/routes/${ routeID }/${ index }`) } disabled={ index <= 0 }>prev</button>
      <button onClick={ () => history.push(`/routes/${ routeID }/${ index + 2 }`) } disabled={ imageIDs.length <= index + 1}>next</button>

      <SceneMetaData />
      
      { MemoizedScene }

      <br/>

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
