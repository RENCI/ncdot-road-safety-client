import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Col, Form, Radio, Row, Select, Typography } from 'antd'
import { ZoomInOutlined as ZoomInIcon, ZoomOutOutlined as ZoomOutIcon } from '@ant-design/icons'
import { api } from '../../../api'
import { useLocalStorage } from '../../../hooks'
import { useRouteContext } from '../context'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { GraphTooltip, Legend, ScatterplotPoint } from './'
import { area, curveStep } from 'd3-shape'
import './scatterplot.css'

const { Text, Title } = Typography

const features = ['guardrail', 'pole']

const initializeFeaturePredictions = () => features.reduce((obj, feature) => ({ ...obj, [feature]: { id: feature, data: [] } }), {})

const ThresholdLineLayer = props => {
  const { selectedFeature, setSelectedFeature } = useRouteContext()
  const { height, width, data } = props
  const [threshold, setThreshold] = useState(0.5)
  const scaledThreshold = useMemo(() => threshold * (height - 16), [threshold])

  useEffect(() => {
    setSelectedFeature(data[0].id)
  }, [data])

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
    if (selectedFeature) {
      fetchThreshold(selectedFeature)
    }
  }, [selectedFeature])

  return (
    <g transform={ `scale(1,-1) translate(0, -${ height - 8 })` }>
      <path className="threshold-line" d={ `M0 ${ scaledThreshold }, ${ width - 48 } ${ scaledThreshold }` } stroke="#222" strokeWidth="1" strokeDasharray="5 10" />
    </g>
  )
}

const AreaLayer = ({ nodes, height, xScale, yScale }) => {
  // Sort by x position for area
  const data = nodes.slice().sort((a, b) => b.x - a.x)

  const areaGenerator = area()
    .curve(curveStep)
    .x0(d => d.x)
    .y0(d => d.y)
    .y1(175)
  return (
    <path d={ areaGenerator(data) } fill="#def" stroke="#1890ff" strokeWidth="0.5" />
  )
}

const Graph = ({ data, min, max }) => {
  const history = useHistory()
  const { currentLocation, images, routeID } = useRouteContext()
  
  const handlePointClick = (node, event) => {
    if (node) {
      history.push(`/routes/${ routeID }/${ +node.data.image.index }`)
    }
  }

  // only render data points that are within the zoomed viewing window
  const visibleData = useMemo(() => {
    if (!data || !data[0]) {
      return []
    }
    return [{ ...data[0], data: data[0].data.filter(d => min <= d.x && d.x <= max) }]
  }, [data, min, max])

  return (
    <div className="predictions-scatterplot__container">
      <ResponsiveScatterPlot
        data={ visibleData }
        height={ 175 }
        margin={{ top: 0, right: 8, bottom: 0, left: 40 }}
        xScale={{ type: 'linear', min: min, max: max }}
        yScale={{ type: 'linear', min: -0.05, max: 1.05, stacked: false, reverse: false }}
        yFormat=" >-.2f"
        animate={ false }
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
        nodeSize={ 7 }
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
          AreaLayer,
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

const ZOOM_LEVELS = [1, 2, 3, 5, 10]

export const PredictionsScatterplot = ({ canZoom }) => {
  const { images, index, selectedFeature, setSelectedFeature } = useRouteContext()
  const [predictions, setPredictions] = useState([])
  const [threshold, setThreshold] = useState()
  const [zoom, setZoom] = useState(1)
  const scrollCatcher = useRef()

  const handleFeatureSelect = value => setSelectedFeature(value)
  const handleZoomSelect = event => setZoom(event.target.value)

  useEffect(() => {
    const handleScroll = event => {
      const deltaZ = -event.deltaY / Math.abs(event.deltaY)
      const oldIndex = ZOOM_LEVELS.indexOf(zoom)
      const newIndex = Math.min(Math.max(0, oldIndex + deltaZ), ZOOM_LEVELS.length - 1)
      if (oldIndex !== newIndex) {
        event.preventDefault()
      }
      setZoom(ZOOM_LEVELS[newIndex])
    }
    if (scrollCatcher.current) {
      scrollCatcher.current.addEventListener('wheel', handleScroll)
      return () => scrollCatcher.current.removeEventListener('wheel', handleScroll)
    }
  }, [zoom])

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

  // massage the prediction data into a format usable by this Nivo graph component.
  useEffect(() => {
    const data = initializeFeaturePredictions()

    images.forEach((image, i) => {
      features.forEach(feature => {
        if (image.features[feature]) {
          data[feature].data.push({ x: i + 1, y: image.features[feature].probability, image })
        }
        // create dummy nodes?
        else { data[feature].data.push({ image }) }
      })
    })

    const hasAnnotation = (d, feature) => {
      return d.image?.features[feature] && typeof d.image.features[feature].annotation === 'boolean'
    }

    // Sort by prediction to render postive/negative above n/a
    features.forEach(feature => {
      data[feature].data.sort((a, b) => {
        const aAnnot = hasAnnotation(a, feature)
        const bAnnot = hasAnnotation(b, feature)

        return aAnnot && !bAnnot ? 1 : !aAnnot && bAnnot ? -1 : 0
      })
    })

    setPredictions(data)
  }, [images])

  // set appropriate { min, max } viewing window along horizontal axis
  const extrema = useMemo(() => {
    if (zoom === 1 || !canZoom ) {
      return {
        min: 1,
        max: images.length,
      }
    }
    const zoomRadius = Math.ceil(images.length / (2 * zoom))
    let min = index - zoomRadius
    let max = index + zoomRadius
    if (min < 1) {
      min = 1
      max = 2 * zoomRadius
    }
    if (max > images.length) {
      min = images.length - 2 * zoomRadius
      max = images.length
    }
    return { min, max }
  }, [images, index, zoom])

  return (
    <Row gutter={ 32 }>
      <Col xs={ 24 } lg={ 18 } ref={ scrollCatcher }>
        <Graph
          data={ [predictions[selectedFeature]] }
          { ...extrema }
        />
      </Col>
      <Col xs={ 24 } lg={ 6 }>
        <Form.Item label="Feature" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Select value={ selectedFeature } onChange={ handleFeatureSelect } style={{ width: '100%' }}>
            { features.map(feature => <Select.Option key={ `feature-option-${ feature }` } value={ feature }>{ feature }</Select.Option>) }
          </Select>
        </Form.Item>
        {
          canZoom && (
            <Form.Item label="Zoom" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              <Radio.Group value={ zoom } onChange={ handleZoomSelect } size="small">
                {
                  ZOOM_LEVELS.map(z => <Radio.Button value={ z }>{ z }&times;</Radio.Button>)
                }
              </Radio.Group>
            </Form.Item>
          )
        }
        <Legend />
      </Col>
    </Row>
  )
}
