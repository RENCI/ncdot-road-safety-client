import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Typography } from 'antd'
import { useParams } from 'react-router-dom'
import { api } from '../../api'

const { Title } = Typography

export const BrowseRouteView = (props) => {
  // grab parameters passed in from the route /routes/:routeID/:imageIndex
  // note that imageIndex is shifted by one for human readability
  const { routeID, imageIndex = 1 } = useParams()
  const [imageIDs, setImageIDs] = useState([])
  const [currentLocation, setCurrentLocation] = useState({})

  console.log({ routeID, imageIndex })

  // grab the image base names for all scenes along this route
  useEffect(() => {
    const fetchRouteImageBaseNames = async () => await api.getRouteInfo(routeID)
      .then(response => {
        console.log(response)
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
    const fetchSceneMetadata = async () => await api.getImageMetadata(imageIDs[index])
      .then(response => {
        console.log(response)
        setCurrentLocation(response.data.metadata)
      })
      .catch(error => console.error(error))
    if (imageIDs.length && index) {
      fetchSceneMetadata()
    }
  }, [routeID, imageIndex])

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
      <pre>
        { JSON.stringify(imageIDs, null, 2) }
      </pre>
    </Fragment>
  )
}
