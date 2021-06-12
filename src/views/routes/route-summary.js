import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Col, Divider, Row, Space, Statistic, Typography } from 'antd'
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

/* we use the above object as a(n inital) container for feature annotation counts,
 * and we contribute to the counts in the `useEffect` below, leaving it
 * looking something like the following:
 * {
 *   guardrail: { absent: 50, none: 50, present: 100 },
 *   pole: { absent: 20, none: 200, present: 10 },
 *   ...
 * }
 */
const initialAnnotationCounts = ['guardrail', 'pole'].reduce((obj, feature) => ({ ...obj, [feature]: { present: 0, absent: 0, none: 0 } }), {})

export const RouteSummaryView = () => {
  const history = useHistory()
  const { routeID, routeLength, images } = useRouteContext()
  const [startingCoordinates, setStartingCoordinates] = useState({ lat: 0, long: 0 })
  const [endingCoordinates, setEndingCoordinates] = useState({ lat: 0, long: 0 })
  const [pathCoordinates, setPathCoordinates] = useState([])
  const [annotationCounts, setAnnotationCounts] = useState()

  useEffect(() => {
    if (!images.length) { return }
    // start counts with empty buckets for each feature (see initialAnnotationCounts def):
    // feature:
    //    absent: 0
    //    none: 0
    //    present: 0
    let counts = initialAnnotationCounts
    // loop over the images
    images.forEach(image => {
      // and loop over each feature (guardrail, pole, etc)
      Object.keys(image.features).forEach(feature => {
        // get current annotations for this image
        let annotations = counts[feature]
        // are we contributing to the `true`s, `false`s, or `N/A`s?
        let featureAnnotationKey = image.features[feature].annotation === true
          ? 'present'
          : image.features[feature].annotation === false
            ? 'absent'
            : 'none'
        // make the appropriate contribution
        annotations = { ...annotations, [featureAnnotationKey]: annotations[featureAnnotationKey] += 1 }
        // combine this feature's annotation counts with the existing overall counts object
        counts = { ...counts, [feature]: annotations }
      })
    })
    // set the counts we've accumulated
    setAnnotationCounts(counts)
    // path should be an array of {lat, long} objects
    const path = images.map(({ location }) => location)
    // set path
    setPathCoordinates(path)
    // set endpoint markers
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


      <div className="route-views-actions">
        <Button type="primary" ghost onClick={ () => history.push(`/routes/${ routeID }/1`) } className="route-action-button" icon={ <CarIcon /> }>Drive Route</Button>
      </div>

      <Divider orientation="center">At a Glance</Divider>

      <Row gutter={ [40, 40] }>
        <Col xs={ 24 } md={ 8 } lg={ 6 } xl={ 4 }>
          <Space direction="vertical">
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
        </Col>

        <Col xs={ 24 } md={ 16 } lg={ 18 } xl={ 20 }>
          <Space direction="vertical" size="large">
            {
              annotationCounts ? Object.keys(annotationCounts).map(feature => {
                return (
                  <Space direction="horizontal" size="large">
                    <Statistic
                      title={ <Title level={ 5 }>{ feature[0].toUpperCase() + feature.slice(1) }</Title> }
                      value={ annotationCounts[feature].present + annotationCounts[feature].absent }
                      suffix={ ` / ${ images.length }` }
                    />
                    <Statistic title="Present" value={ annotationCounts[feature].present } valueStyle={{ color: 'var(--color-positive)' }} />
                    <Statistic title="Absent" value={ annotationCounts[feature].absent } valueStyle={{ color: 'var(--color-negative)' }} />
                    <Statistic title="None" value={ annotationCounts[feature].none } valueStyle={{ color: 'var(--color-neutral)' }} />
                  </Space>
                )
              }) : 'Totaling annotations...'
            }
          </Space>
        </Col>
      </Row>

      <Divider orientation="center">Annotations & Predictions</Divider>

      <PredictionsScatterplot />

      <Divider orientation="center">Map</Divider>

      <Map
        markers={ [startingCoordinates, endingCoordinates] }
        path={ pathCoordinates }
        height="600px"
        zoom={ 13 }
      />

    </Fragment>
  )
}
