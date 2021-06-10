import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Divider, Space, Statistic, Typography } from 'antd'
import {
  CameraOutlined as ImageIcon,
  CarOutlined as CarIcon,
  CheckCircleOutlined as AnnotationIcon,
} from '@ant-design/icons'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { api } from '../../api'
import {
  PredictionsScatterplot,
  useRouteContext,
} from '../../components/route-browser'
import { Map } from '../../components/map'

const { Text, Title } = Typography

const initialAnnotationCounts = ['guardrail', 'pole'].reduce((obj, feature) => ({ ...obj, [feature]: {} }), {})

export const RouteSummaryView = () => {
  const history = useHistory()
  const { routeID, routeLength, images } = useRouteContext()
  const [startingCoordinates, setStartingCoordinates] = useState({ lat: 0, long: 0 })
  const [endingCoordinates, setEndingCoordinates] = useState({ lat: 0, long: 0 })
  const [pathCoordinates, setPathCoordinates] = useState([])
  const [annotationCounts, setAnnotationCounts] = useState()

  useEffect(() => {
    if (!images.length) { return }
    let counts = {}
    images.forEach(image => {
      Object.keys(image.features).forEach(feature => {
        if (feature in counts) {
          counts[feature] += 1
        } else {
          counts[feature] = 1
        }
      })
    })
    setAnnotationCounts(counts)
    const path = images.map(({ location }) => location)
    setPathCoordinates(path)
    setStartingCoordinates(path[0])
    setEndingCoordinates(path.slice(-1)[0])
  }, [images])

  return (
    <Fragment>
      <Breadcrumbs crumbs={[
        { text: 'Home', path: '/' },
        { text: 'Routes', path: `/routes` },
        { text: routeID, path: `/routes/${ routeID }` },
      ]} />

      <Divider orientation="left">At a Glance</Divider>

      <div className="route-views-actions">
        <Button type="primary" ghost onClick={ () => history.push(`/routes/${ routeID }/1`) } className="route-action-button" icon={ <CarIcon /> }>Drive Route</Button>
      </div>

      <div className="stats" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Space direction="horizontal" size="large">
          {
            annotationCounts ? Object.keys(annotationCounts).map(feature => (
              <Statistic
                title={
                  <Space direction="horizontal" align="center" size="small">
                    <AnnotationIcon style={{ color: annotationCounts[feature] === images.length ? 'var(--color-positive)' : 'var(--color-negative)' }} />
                    <Text>{ feature }</Text>
                  </Space>
                }
                value={ annotationCounts[feature] }
                suffix={ ` / ${ images.length }` }
              />
            )) : 'Totaling annotations...'
          }
        </Space>
        <Space direction="vertical" split={ <Divider /> }>
          <Statistic
            title={ <Space direction="horizontal" align="center" size="small"><ImageIcon /><Text>Image Count</Text></Space>}
            value={ images.length }
          />
          <Statistic
            title={ <Space direction="horizontal" align="center" size="small"><CarIcon /><Text>Route Length</Text></Space>}
            value={ routeLength.toFixed(4) }
            suffix="miles"
          />
        </Space>
      </div>

      <Divider orientation="left">Annotations & Predictions</Divider>

      <PredictionsScatterplot />

      <Divider orientation="left">Map</Divider>

      <Map
        markers={ [startingCoordinates, endingCoordinates] }
        path={ pathCoordinates }
        height="600px"
        zoom={ 13 }
      />

    </Fragment>
  )
}
