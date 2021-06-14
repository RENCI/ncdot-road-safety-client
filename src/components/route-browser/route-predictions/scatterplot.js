import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Card, Col, Row, Select, Space, Typography } from 'antd'
import { useRouteContext } from '../context'
import { api } from '../../../api'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { GraphTooltip, Legend, ScatterplotPoint } from './'
import './scatterplot.css'

const { Text } = Typography

const features = ['guardrail', 'pole']

const initialFeaturePredictions = features.reduce((obj, feature) => ({ ...obj, [feature]: { id: feature, data: [] } }), {})

const ThresholdLineLayer = ({ height, width }) => <path d={ `M0 ${ height / 2 }, ${ width - 48 } ${ height / 2 }` } stroke="#000" strokeWidth="0.5" strokeDasharray="1 1" />

const Graph = ({ data }) => {
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

export const PredictionsScatterplot = ({ key }) => {
  const { images } = useRouteContext()
  const [predictions, setPredictions] = useState([])
  const [selectedFeature, setSelectedFeature] = useState('guardrail')

  const handleFeatureSelect = value => setSelectedFeature(value)

  // massage the prediction data into a format usable by this Nivo graph component.
  useEffect(() => {
    const data = { ...initialFeaturePredictions }
    images.forEach((image, i) => {
      features.forEach(feature => {
        if (image.features[feature]) {
          data[feature].data.push({ x: i + 1, y: image.features[feature].probability, image })
        }
        // create dummy nodes?
        else { data[feature].data.push({ x: i, y: -1 }) }
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
