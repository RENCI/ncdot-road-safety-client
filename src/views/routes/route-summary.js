import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Divider, Statistic, Typography } from 'antd'
import {
  CameraOutlined as ImageIcon,
  CarOutlined as CarIcon,
} from '@ant-design/icons'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { api } from '../../api'
import {
  PredictionsGraph,
  useRouteContext,
} from '../../components/route-browser'
import { Map } from '../../components/map'

const { Text, Title } = Typography

const markerStyles = {
  start: { color: 'var(--color-positive)', style: 'cross' },
  end: { color: 'var(--color-negative)', style: 'x' },
}

const initialAnnotationCounts = ['guardrail', 'pole'].reduce((obj, feature) => ({ ...obj, [feature]: {} }), {})

export const RouteSummaryView = () => {
  const history = useHistory()
  const { routeID, routeLength, images } = useRouteContext()
  const [startingCoordinates, setStartingCoordinates] = useState({ lat: 0, long: 0 })
  const [endingCoordinates, setEndingCoordinates] = useState({ lat: 0, long: 0 })
  const [annotationCounts, setAnnotationCounts] = useState()

  useEffect(() => {
    if (!images.length) { return }
    let counts = {}
    images.forEach(image => {
      console.log(image.image_base_name)
      Object.keys(image.features).forEach(feature => {
        console.log(feature.name)
        if (feature.name in counts) {
          counts[feature.name] += 1
        } else {
          counts[feature.name] = 1
        }
      })
    })
    setAnnotationCounts(counts)
  }, [routeID])

  useEffect(() => {
    if (!images.length) { return }
    const constructMapMarkers = async () => {
      try {
        const response = await Promise.all([
          api.getImageMetadata(images[0].image_base_name), // first route image
          api.getImageMetadata(images.slice(-1)[0].image_base_name) // last route image
        ])
        const [start, end] = response.map(res => res.data.metadata)
        setStartingCoordinates({ long: start.long, lat: start.lat, ...markerStyles.start })
        setEndingCoordinates({ long: end.long, lat: end.lat, ...markerStyles.end })
      } catch (error) {
        console.log(error)
      }
    }
    constructMapMarkers()
  }, [images])

  return (
    <Fragment>
      <Breadcrumbs crumbs={[
        { text: 'Home', path: '/' },
        { text: 'Routes', path: `/routes` },
        { text: routeID, path: `/routes/${ routeID }` },
      ]} />

      <Divider orientation="left">At a Glance</Divider>

      <Statistic title="Image Count" value={ images.length } prefix={ <ImageIcon /> } />
      <Statistic title="Route Length" value={ routeLength.toFixed(4) } prefix={ <CarIcon /> } suffix="miles" />
      <pre>
        sdsd
        { JSON.stringify(annotationCounts, null, 2) }
      </pre>

      <Divider orientation="left">Annotations & Predictions</Divider>

      <PredictionsGraph />

      <Divider orientation="left">Route Actions</Divider>

      <Button type="primary" ghost onClick={ () => history.push(`/routes/${ routeID }/1`) } className="browse-route-button">
        <CarIcon /> Drive Route
      </Button>

      <Divider orientation="left">Map</Divider>

      <Map markers={ [startingCoordinates, endingCoordinates] } height="600px" zoom={ 13 }/>

    </Fragment>
  )
}
