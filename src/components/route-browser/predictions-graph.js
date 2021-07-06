import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Card, Col, Row, Select, Typography } from 'antd'
import { useRouteContext } from './context'
import { api } from '../../api'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import './predictions-graph.css'

const { Text } = Typography

const features = ['guardrail', 'pole']

const initialData = features.reduce((obj, feature) => ({ ...obj, [feature]: { id: feature, data: [] } }), {})

export const GraphTooltip = ({ node }) => {
  const { images } = useRouteContext()

  return (
    <Card title={ node.data.image.image_base_name } className="predictions-graph__tooltip">
      <Text>image #{ node.data.image.index }</Text><br/>
      <pre style={{ fontSize: '50%' }}>
        { JSON.stringify(node.data, null, 2) }
      </pre>
    </Card>
  )
}

const Legend = () => {
  const colors = [
    { color: `var(--color-positive)`, description: `Positive Annotation` },
    { color: `var(--color-neutral)`,  description: `No Annotation` },
    { color: `var(--color-negative)`, description: `Negative Annotation` },
  ]
  return (
    <div className="legend">
      {
        colors.map(item => <div><Text key={ `legend-item_${ item.color }` } style={{ color: item.color, fontSize: '150%' }}>●</Text> { item.description }</div>)
      }
    </div>
  )
}

const CustomNode = ({ node, x, y, size, color, blendMode, onMouseEnter, onMouseMove, onMouseLeave, onClick }) => {
  const { imageIndex, images } = useRouteContext()
  const [active, setActive] = useState(false)

  const fillColor = node.data.image.features[node.data.serieId].annotation === true
    ? 'var(--color-positive)'
    : node.data.image.features[node.data.serieId].annotation === false
      ? 'var(--color-negative)'
      : '#ccc'

  useEffect(() => {
    setActive(+imageIndex === node.data.image.index)
  }, [imageIndex])

  return (
    <Fragment>
      <g transform={`translate(${ x },${ y })`}>
        {
          active && (
            <circle className="active-pulse" r={ size } fill={ color } style={{ mixBlendMode: blendMode }}>
              <animate attributeName="r" begin="0s" dur="1s" repeatCount="indefinite" from="3" to="12"/>
              <animate attributeName="opacity" begin="0s" dur="1s" repeatCount="indefinite" from="1" to="0"/>
            </circle>
          )
        }
        <circle
          r={ size / 2 }
          fill={ fillColor }
          style={{ mixBlendMode: blendMode }}
          onMouseEnter={ onMouseEnter }
          onMouseLeave={ onMouseLeave }
          onClick={ onClick }
        />
      </g>
      { active && <path d={ `M${ x } ${ y },${ x } 200` } strokeWidth="0.5" stroke="#000000" strokeDasharray="5,5" /> }
      { active && <path d={ `M0 ${ y },${ x } ${ y }` } strokeWidth="0.5" stroke="#000000" strokeDasharray="5,5" /> }
    </Fragment>
  )
}

const Graph = ({ data }) => {
  const history = useHistory()
  const { currentLocation, images, routeID } = useRouteContext()
  
  const handlePointClick = (node, event) => {
    if (node) {
      history.push(`/routes/${ routeID }/${ +node.data.image.index }`)
    }
  }

  return (
    <div className="predictions-graph">
      <ResponsiveScatterPlot
        data={ data }
        height={ 200 }
        margin={{ top: 0, right: 8, bottom: 0, left: 40 }}
        xScale={{ type: 'linear', min: 1, max: images.length }}
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
        nodeSize={ 4 }
        pointLabelYOffset={ -12 }
        tooltip={ ({ node }) => <GraphTooltip node={ node } /> }
        onClick={ handlePointClick }
        renderNode={ CustomNode }
        theme={{
          axis: { textColor: '#00000066', fontSize: '8px', tickColor: '#00000099', },
        }}
      />
    </div>
  )
}

export const PredictionsGraph = ({ key }) => {
  const { images } = useRouteContext()
  const [predictions, setPredictions] = useState([])
  const [selectedFeature, setSelectedFeature] = useState('guardrail')

  const handleFeatureSelect = value => setSelectedFeature(value)

  // massage the prediction data into a format usable by this Nivo graph component.
  useEffect(() => {
    const data = { ...initialData }
    images.forEach((image, i) => {
      features.forEach(feature => {
        if (image.features[feature]) {
          data[feature].data.push({ x: i + 1, y: image.features[feature].probability, image })
        }
        // create dummy nodes?
        // else { data[feature].data.push({ x: i, y: -1 }) }
      })
    })
    setPredictions(data)
  }, [images])

  return (
    <Row gutter={ 32 }>
      <Col xs={ 24 } lg={ 18 }>
        <Graph data={ [predictions[selectedFeature]] } />
      </Col>
      <Col xs={ 24 } lg={ 6 }>
        <Select value={ selectedFeature } onChange={ handleFeatureSelect } style={{ width: '100%' }}>
          { features.map(feature => <Select.Option key={ `feature-option-${ feature }` } value={ feature }>{ feature }</Select.Option>) }
        </Select>
        <Legend />
      </Col>
    </Row>
  )
}