import React, { useEffect, useMemo, useState } from 'react'
import { Route, BrowserRouter as Router, useParams } from 'react-router-dom'
import { api } from '../../api'
import { Typography } from 'antd'
import { Scene } from '../../components/scene'
import { RouteContextProvider } from '../../components/route-browser'
import { RouteBrowserView, RouteSummaryView } from './'
import { useLocalStorage } from '../../hooks'

const { Title } = Typography

/**
  TODO:
  - fetch the feature ids.
  */
const features = ['guardrail', 'pole']

/*
 * Think of this view as a Router for the Route View
 * in the sense that it handles getting users to one
 * of the following Route child views:
 * 
 *   - ROUTE SUMMARY ( /routes/<routeID> )
 *   - ROUTE BROWSER ( /routes/<routeID>/<imageIndex> )
 * 
 * This is accomplished solely based on the imageIndex variable extracted
 * from the URL. Note that component is wrapped with the Route Context Provider
 * so that both child views have access to the route details. Also note that `index`
 * is the zero-based index, while `imageIndex` is the one-based index. Because
 *  it is a more intuitive way for users to think about indexing, we use
 * `iamgeIndex` when rendering the index to the user, inluding in the URL.
*/

export const RouteView = () => {
  // note that imageIndex is shifted by one for human readability
  const { routeID, imageIndex } = useParams()
  const [images, setImages] = useState([])
  const [routeLength, setRouteLength] = useState(0)
  const [index, setIndex] = useState(-1)
  const [falsePositives, setFalsePositives] = useState(features.reduce((obj, feature) => ({ ...obj, [feature]: [] }), {}))
  const [falseNegatives, setFalseNegatives] = useState(features.reduce((obj, feature) => ({ ...obj, [feature]: [] }), {}))
  const [selectedFeature, setSelectedFeature] = useLocalStorage('rhf-annotation-feature', 'guardrail')

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

  // when the routeID changes (from the URL),
  // grab the image base names for all scenes along this route,
  // along with the annotation & prediction info
  useEffect(() => {
    let scenes = {}
    
    const fetchRouteInfo = async () => {

      const promises = [
        api.getRouteInfo(routeID), // route info
        ...features.map(feature => api.getRoutePredictionInfo(routeID, feature)) // predictions
      ]

      const responses = await Promise.all(promises)

      const [routeResponse, ...predictionsResponses] = responses

      routeResponse.data.route_image_info.forEach((item, i) => {
        scenes[item.image_base_name] = {
          index: i + 1,
          image_base_name: item.image_base_name,
          mile_post: item.mile_post,
          location: item.location,
          features: {},
        }
      })

      // ^ Note that the order-preservation of resolved values in Promise.all()
      // guarantees the order of responses matches the order of the feature names in the
      // `features` array, which we use to construct the array of promises. This means
      // indexing `features` matches the indexing of the predictions promises' responses.

      predictionsResponses.forEach((response, i) => {
        response.data.route_image_info.forEach(item => {
          scenes[item.image_base_name].features[features[i]] = {
            name: features[i],
            annotation: item.presence,
            probability: item.probability,
          }
        })
      })

      setImages(Object.values(scenes))
    }

    fetchRouteInfo()
  }, [routeID])

  useEffect(() => {
    const fetchFalseNegativeIndices = async () => {
      try {
        const promises = features.map(feature => api.getFalseNegatives(feature, routeID))
        const responses = await Promise.all(promises)
        let newErrors = {}
        responses.forEach((response, i) => {
          const indices = response.data.fns_info.map(item => item.route_index).sort((i, j) => i < j ? -1 : 1)
          newErrors[features[i]] = indices
        })
        setFalseNegatives(newErrors)
      } catch (error) {
        console.info('There was an error fetching false negatives.')
        console.error(error)
      }
    }
    const fetchFalsePositiveIndices = async () => {
      try {
        const promises = features.map(feature => api.getFalsePositives(feature, routeID))
        const responses = await Promise.all(promises)
        let newErrors = {}
        responses.forEach((response, i) => {
          const indices = response.data.fps_info.map(item => item.route_index).sort((i, j) => i < j ? -1 : 1)
          newErrors[features[i]] = indices
        })
        setFalsePositives(newErrors)
      } catch (error) {
        console.info('There was an error fetching false positives.')
        console.error(error)
      }
    }
    fetchFalsePositiveIndices()
    fetchFalseNegativeIndices()
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
    <RouteContextProvider value={{ routeID, routeLength, images, index, imageIndex, currentLocation, selectedFeature, setSelectedFeature, falsePositives, falseNegatives }}>

      <Title level={ 1 }>Route { routeID }</Title>

      <Route exact path="/routes/:routeID"><RouteSummaryView /></Route>
      <Route exact path="/routes/:routeID/:imageIndex"><RouteBrowserView /></Route>

    </RouteContextProvider>
  )
}
