import React, { useEffect, useMemo, useState } from 'react'
import { Route, BrowserRouter as Router, useParams } from 'react-router-dom'
import { api } from '../../api'
import { Typography } from 'antd'
import { Scene } from '../../components/scene'
import { RouteContextProvider } from '../../components/route-browser'
import { RouteBrowserView, RouteSummaryView } from './'

const { Title } = Typography

/**
  TODO:
  - fetch the feature ids.
  */
const features = ['guardrail', 'pole']

// from the above array, construct an empty predictions object
// that looks like this { guardrail: {}, pole: {}, ... }
const initialPredictions = features.reduce((obj, key) => ({ ...obj, [key]: { name: key, annotation: null, probability: null } }), {})

/*
 * Think of this view as a Router in the sense that it handles
 * getting users to one of the following Route child views:
 * 
 *   - ROUTE SUMMARY ( /routes/<routeID> )
 *   - ROUTE BROWSER ( /routes/<routeID>/<imageIndex> )
 * 
 * This is accomplished solely based on the imageIndex variable extracted
 * from the URL params. Note that component is wrapped with the Route
 * Context Provider so that both child views have access to the route details.
 * Also note that `index` is the zero-based index, while imageIndex is the
 * one-based index. Because it is a more user-friendly way to index, we use
 * `iamgeIndex` when rendering the index to the user, inluding in the URL.
*/

export const RouteView = () => {
  // note that imageIndex is shifted by one for human readability
  const { routeID, imageIndex } = useParams()
  const [images, setImages] = useState([])
  const [routeLength, setRouteLength] = useState(0)
  const [index, setIndex] = useState(-1)

  const currentLocation = useMemo(() => {
    if (images && imageIndex) {
      return images[index]
    }
  }, [index])

  useEffect(() => {
    const i = +imageIndex - 1
    // ensure index lies outside 0..(# of images - 1)
    if (i < 0 || images.length < i + 1) { return; }
    // ok, let's go to image i along the route
    setIndex(i)
  }, [imageIndex, images.length])

  // grab the image base names for all scenes along this route
  useEffect(() => {
    let scenes = {}
    
    const fetchRouteInfo = async () => {

      const promises = [
        api.getRouteInfo(routeID),
        ...features.map(feature => api.getRoutePredictionInfo(routeID, feature))
      ]

      const responses = await Promise.all(promises)

      const [routeResponse, ...predictionsResponse] = responses
      
      routeResponse.data.route_image_info.forEach(item => {
        scenes[item.image_base_name] = {
          image_base_name: item.image_base_name,
          mile_post: item.mile_post,
          location: item.location,
          features: initialPredictions,
        }
      })

      predictionsResponse.forEach(response => {
        response.data.route_image_info.forEach((item, i) => {
          if (scenes[item.image_base_name].features[features[i]]) {
            scenes[item.image_base_name].features[features[i]].annotation = item.presence
            scenes[item.image_base_name].features[features[i]].probability = item.probability
          }
        })
      })

      setImages(Object.values(scenes))
    }

    fetchRouteInfo()
  }, [routeID])

  useEffect(() => {
    if (images.length) {
      const lastImage = images.slice(-1)
      setRouteLength(lastImage[0].mile_post)
    }
  })

  // when route changes, update the document title with route & image info
  useEffect(() => { document.title = `Route ${ routeID } | RHF` }, [routeID])

  return (
    <RouteContextProvider value={{ routeID, routeLength, images, index, imageIndex, currentLocation }}>

      <Title level={ 1 }>Route { routeID }</Title>

      <Route exact path="/routes/:routeID"><RouteSummaryView /></Route>
      <Route exact path="/routes/:routeID/:imageIndex"><RouteBrowserView /></Route>

    </RouteContextProvider>
  )
}
