import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Divider, Typography } from 'antd'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { api } from '../../api'
import {
  PredictionsGraph,
  useRouteContext,
} from '../../components/route-browser'
import { CarOutlined as CarIcon } from '@ant-design/icons'
import { Map } from '../../components/map'

const { Text, } = Typography

const markerStyles = {
  start: { color: 'var(--color-positive)', style: 'cross' },
  end: { color: 'var(--color-negative)', style: 'x' },
}

export const RouteSummaryView = () => {
  const history = useHistory()
  const { routeID, routeLength, images } = useRouteContext()
  const [startingCoordinates, setStartingCoordinates] = useState({ lat: 0, long: 0 })
  const [endingCoordinates, setEndingCoordinates] = useState({ lat: 0, long: 0 })

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

      <Divider />

      <Map markers={ [startingCoordinates, endingCoordinates] } height="600px" zoom={ 13 }/>

      <Divider />

      <PredictionsGraph />

      <Divider />

      <Text>Image count: { images.length }</Text>

      <Divider />

      <Text>Route length: { routeLength } miles</Text>

      <Divider />

      <Button type="primary" ghost onClick={ () => history.push(`/routes/${ routeID }/1`) } className="browse-route-button">
        <CarIcon /> Drive Route
      </Button>

    </Fragment>
  )
}
