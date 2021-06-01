import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../api'
import { Typography } from 'antd'
import { Scene } from '../../components/scene'
import { RouteContextProvider } from '../../components/route-browser'
import { RouteBrowserView, RouteSummaryView } from './'

const { Title } = Typography

/*
 * Think of this view as a Router in the sense that it handles
 * getting users to one of the following Route child views:
 * 
 *   - ROUTE SUMMARY ( /routes/<routeID> )
 *   - ROUTE BROWSER ( /routes/<routeID>/<imageIndex> )
 * 
 * This is accomplished solely based on the imageIndex variable
 * extracted from the URL params. Note that component is wrapped
 * with the Route Context Provider so that both child views
 * have access to the route details.
 * Also note that `index` is the zero-based index,
 * while imageIndex is the one-based index. Because it is a more
 * user-friendly way to index, we use `iamgeIndex` when rendering the
 * index to the user, inluding in the URL.
*/

export const RouteView = () => {
  // grab parameters passed in from the route /routes/:routeID/:imageIndex
  // note that imageIndex is shifted by one for human readability
  const { routeID, imageIndex } = useParams()
  const [images, setImages] = useState([])
  const [routeLength, setRouteLength] = useState(0)
  const [currentLocation, setCurrentLocation] = useState({})
  const [index, setIndex] = useState(0)

  useEffect(() => {
    // use index 0... (which will render the Route Overview view)
    // ...if no imageIndex
    if (!imageIndex) { setIndex(-1); return; }
    // ...if no route or no images on route
    if (!routeID || images.length === 0) { setIndex(-1); return; }
    const i = parseInt(imageIndex) - 1
    // ...if index lies outside 0..(# of images - 1)
    if (i < 0 || images.length < i + 1) { setIndex(-1); return; }
    // ok, let's go to image i along the route
    setIndex(i)
  }, [imageIndex, images.length])

  // grab the image base names for all scenes along this route
  useEffect(() => {
    const fetchRouteImages = async () => await api.getRouteInfo(routeID)
      .then(response => {
        setImages(response.data.route_image_info)
      })
      .catch(error => console.error(error))
    fetchRouteImages()
  }, [routeID])

  useEffect(() => {
    if (images.length) {
      const lastImage = images.slice(-1)
      setRouteLength(lastImage[0].mile_post)
    }
  }, [images.length])

  // when route changes, update the document title with route & image info
  useEffect(() => { document.title = `Route ${ routeID } | RHF` }, [routeID])

  return (
    <RouteContextProvider value={{ routeID, routeLength, images, index, imageIndex, currentLocation, setCurrentLocation }}>

      <Title level={ 1 }>Route { routeID }</Title>

      {
        index === -1
          ? <RouteSummaryView />
          : <RouteBrowserView />
      }

    </RouteContextProvider>
  )
}
