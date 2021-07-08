import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Card, Col, Row, Select, Space, Typography } from 'antd'
import { ZoomInOutlined as ZoomInIcon, ZoomOutOutlined as ZoomOutIcon } from '@ant-design/icons'
import { useRouteContext } from '../context'
import { api } from '../../../api'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { GraphTooltip, Legend, ScatterplotPoint } from './'
import './scatterplot.css'

const { Text, Title } = Typography

const features = ['guardrail', 'pole']

const initialFeaturePredictions = features.reduce((obj, feature) => ({ ...obj, [feature]: { id: feature, data: [] } }), {})

const ThresholdLineLayer = props => {
  const { height, width, data } = props
  const [feature, setFeature] = useState()
  const [threshold, setThreshold] = useState(0.5)
  const scaledThreshold = useMemo(() => threshold * (height - 16), [threshold])

  useEffect(() => {
    setFeature(data[0].id)
  }, [data])

  useEffect(() => {
    const fetchThreshold = async () => {
      try {
        const { data } = await api.getThreshold(feature)
        if (!data) {
          throw new Error('An error occurred while fetching thresholds.')
        }
        setThreshold(data.model_threshold)
      } catch (error) {
        console.error(error)
      }
    }
    if (feature) {
      fetchThreshold(feature)
    }
  }, [feature])

  return (
    <g transform={ `scale(1,-1) translate(0, -${ height - 8 })` }>
      <path className="threshold-line" d={ `M0 ${ scaledThreshold }, ${ width - 48 } ${ scaledThreshold }` } stroke="#222" strokeWidth="1" strokeDasharray="5 10" />
    </g>
  )
}

const Graph = ({ data, min, max, predictionThreshold }) => {
  const history = useHistory()
  const { currentLocation, images, routeID } = useRouteContext()
  
  const handlePointClick = (node, event) => {
    if (node) {
      history.push(`/routes/${ routeID }/${ +node.data.image.index }`)
    }
  }

  return (
    <div className="predictions-scatterplot__container">
      <ResponsiveScatterPlot
        data={ data }
        height={ 175 }
        margin={{ top: 0, right: 8, bottom: 0, left: 40 }}
        xScale={{ type: 'linear', min: min, max: max }}
        yScale={{ type: 'linear', min: -0.05, max: 1.05, stacked: false, reverse: false }}
        yFormat=" >-.2f"
        enableGridX={ true }
        enableGridY={ true }
        axisTop={ null }
        axisLeft={{
          orient: 'left',
          tickSize: 3,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Probability',
          legendPosition: 'middle',
          legendOffset: -35
        }}
        axisRight={ null }
        axisBottom={ null }
        nodeSize={ 5 }
        pointLabelYOffset={ -12 }
        tooltip={ ({ node }) => <GraphTooltip node={ node } /> }
        onClick={ handlePointClick }
        renderNode={ ScatterplotPoint }
        theme={{
          axis: {
            textColor: '#00000066',
            fontSize: '8px',
            tickColor: '#00000099',
          },
        }}
        layers={[
          'grid',
          'axes',
          ThresholdLineLayer,
          'nodes',
          'markers',
          'mesh',
          'legends',
          'annotations',
        ]}
      />
    </div>
  )
}

export const PredictionsScatterplot = ({ canZoom }) => {
  const { images, index } = useRouteContext()
  const [predictions, setPredictions] = useState([])
  const [selectedFeature, setSelectedFeature] = useState('guardrail')
  const [threshold, setThreshold] = useState()
  const [zoom, setZoom] = useState(1)
  const handleFeatureSelect = value => setSelectedFeature(value)
  const handleZoomSelect = value => setZoom(value)

  const extrema = useMemo(() => {
    if (zoom === 1 || !canZoom ) {
      return {
        min: 1,
        max: images.length,
      }
    }
    const zoomRadius = Math.ceil(images.length / (2 * zoom))
    let min = Math.max(0, index - zoomRadius)
    let max = Math.min(images.length, index + zoomRadius)
    if (min < 1) {
      min = 1
      max = 2 * zoomRadius
    }
    if (max > images.length) {
      min -= images.length - 2 * zoomRadius
      max = images.length
    }
    return {
      min: min,
      max: max,
    }
  }, [images, index, zoom])

  // massage the prediction data into a format usable by this Nivo graph component.
  useEffect(() => {
    const data = { ...initialFeaturePredictions }
    images.forEach((image, i) => {
      features.forEach(feature => {
        if (image.features[feature]) {
          data[feature].data.push({ x: i + 1, y: image.features[feature].probability, image })
        }
        // create dummy nodes?
        else { data[feature].data.push({ image }) }
      })
    })
    setPredictions(data)
  }, [images])

  useEffect(() => {
    const fetchThreshold = async () => {
      try {
        const { data } = await api.getThreshold(selectedFeature)
        if (!data) {
          throw new Error('An error occurred while fetching thresholds.')
        }
        setThreshold(data.model_threshold)
      } catch (error) {
        console.error(error)
      }
    }
    fetchThreshold(selectedFeature)
  }, [selectedFeature])

  return (
    <Row gutter={ 32 }>
      <Col xs={ 24 } lg={ 18 }>
        <Graph data={ [predictions[selectedFeature]] } predictionThreshold={ threshold } min={ extrema.min } max={ extrema.max } />
      </Col>
      <Col xs={ 24 } lg={ 6 }>
        <Select value={ selectedFeature } onChange={ handleFeatureSelect } style={{ width: '100%' }}>
          { features.map(feature => <Select.Option key={ `feature-option-${ feature }` } value={ feature }>{ feature }</Select.Option>) }
        </Select>
        {
          canZoom && (
            <Select value={ zoom } onChange={ handleZoomSelect } style={{ width: '100%' }}>
              { [1, 2, 3, 4, 5].map(level => <Select.Option key={ `zoom-option-${ level }x` } value={ level }>{ `Zoom ${ level }x` }</Select.Option>) }
            </Select>
          )
        }
        <Legend />
      </Col>
    </Row>
  )
}
