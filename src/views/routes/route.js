import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumb, Typography } from 'antd'
import { api } from '../../api'

const { Title } = Typography

export const BrowseRouteView = (props) => {
  // grab parameters passed in from the route /routes/:routeID/:imageIndex
  // note that imageIndex is shifted by one for human readability
  const { routeID, imageIndex = 1 } = useParams()
  const [imageIDs, setImageIDs] = useState([])
  const [currentLocation, setCurrentLocation] = useState({})

  console.log({ routeID, imageIndex })

  const index = useMemo(() => {
    // if no route or no images on route
    if (!routeID || imageIDs.length === 0) { return 0 }
    // if image index lies outside 0..(# of images)
    if (imageIndex < 1 || imageIndex > imageIDs.length) { return 0 }
    // if the image index contains only digits
    if (/^\d+$/.test(imageIndex)) { return +imageIndex }
    return 1
  }, [imageIDs, imageIndex])

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
  useEffect(() => { document.title = `Route ${ routeID }, #${ imageIndex } | RHF` }, [routeID, imageIndex])

  // when scene/location changes,
  // fetch metadata for the current location's scene
  useEffect(() => {
    console.log(routeID, imageIDs[imageIndex - 1])
    const fetchSceneMetadata = async () => await api.getImageMetadata(imageIDs[index])
      .then(response => {
        const coordinates = { lat: response.data.metadata.lat, long: response.data.metadata.long }
        setCurrentLocation(coordinates)
      })
      .catch(error => console.error(error))
    if (imageIDs.length && index) {
      fetchSceneMetadata()
    }
  }, [imageIDs, routeID, imageIndex])

  return (
    <Fragment>
      <Title level={ 1 }>Route { routeID }</Title>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/routes">Routes</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={ `/routes/${ routeID }` }>{ routeID }</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{ imageIndex }</Breadcrumb.Item>
      </Breadcrumb>
      <Title level={ 2 }>Image IDs</Title>
      <pre>
        { JSON.stringify(imageIDs, null, 2) }
      </pre>
      <Title level={ 2 }>Current Location</Title>
      <pre>
        { JSON.stringify(currentLocation, null, 2) }
      </pre>
    </Fragment>
  )
}
