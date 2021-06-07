import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Card, Col, Row, Select, Typography } from 'antd'
import { useRouteContext } from './context'
import { api } from '../../api'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import './predictions-graph.css'

const { Text } = Typography

const colors = {
  positive: '#7fbf7b',
  neutral: '#f7f7f7',
  negative: '#af8dc3',
}

const features = ['guardrail', 'pole']

const initialData = features.reduce((obj, feature) => ({ ...obj, [feature]: { id: feature, data: [] } }), {})

export const GraphTooltip = ({ node }) => {
  const { images } = useRouteContext()

  return (
    <Card title={ node.data.image.image_base_name } className="predictions-graph__tooltip">
      <Text>image #{ node.data.image.index }</Text><br/>
      <pre style={{ fontSize: '50%' }}>
        { JSON.stringify(node.data.image, null, 2) }
      </pre>
    </Card>
  )
}

const CustomNode = ({ node, x, y, size, color, blendMode, onMouseEnter, onMouseMove, onMouseLeave, onClick }) => {
  const { imageIndex, images } = useRouteContext()
  const [active, setActive] = useState(false)

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
          fill={ color }
          style={{ mixBlendMode: blendMode }}
          onMouseEnter={ onMouseEnter }
          onMouseMove={ onMouseMove }
          onMouseLeave={ onMouseLeave }
          onClick={ onClick }
        />
      </g>
      { active && <path d={ `M${ x } 0,${ x } 200` } strokeWidth="0.5" stroke="#000000" strokeDasharray="5,5" /> }
      { active && <path d={ `M0 ${ y },1000 ${ y }` } strokeWidth="0.5" stroke="#000000" strokeDasharray="5,5" /> }
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

  const handleMouseMove = (node, event) => {
    // const highlightedNode = console.log(node)
  }

  // highlight current location's data points in graph
  useEffect(() => {
    console.log('start looking for point')

    

    console.log('finish looking for point')
  }, [currentLocation])

  return (
    <div className="predictions-graph">
      <ResponsiveScatterPlot
        data={ data }
        height={ 200 }
        margin={{ top: 0, right: 8, bottom: 0, left: 8 }}
        xScale={{ type: 'linear', min: 1, max: images.length }}
        yScale={{ type: 'linear', min: 0, max: 1, stacked: false, reverse: false }}
        yFormat=" >-.2f"
        enableGridX={ false }
        enableGridY={ false }
        axisTop={ null }
        axisLeft={ null }
        axisRight={ null }
        axisBottom={ null }
        nodeSize={ 4 }
        pointLabelYOffset={ -12 }
        tooltip={ ({ node }) => <GraphTooltip node={ node } /> }
        onClick={ handlePointClick }
        onMouseMove={ handleMouseMove }
        renderNode={ CustomNode }
      />
    </div>
  )
}

export const PredictionsGraph = ({ key }) => {
  const { images } = useRouteContext()
  const [predictions, setPredictions] = useState([])
  const [selectedFeature, setSelectedFeature] = useState('guardrail')

  // massage prediction data into a format usable by this Nivo graph component.
  useEffect(() => {
    const data = { ...initialData }
    images.forEach((image, i) => {
      features.forEach(feature => {
        if (image.features[feature]) {
          data[feature].data.push({ x: i + 1, y: image.features[feature].probability, image })
        } //else {
        //   data[feature].data.push({ x: i, y: -1 })
        // }
      })
    })
    console.log(data)
    console.log(data[selectedFeature])
    setPredictions(data)
  }, [images])

  const handleFeatureSelect = value => {
    console.log(value)
    setSelectedFeature(value)
  }

  return (
    <Row gutter={ 32 }>
      <Col xs={ 24 } lg={ 18 }>
        <Graph data={ [predictions[selectedFeature]] } />
      </Col>
      <Col xs={ 24 } lg={ 6 }>
        <Select value={ selectedFeature } onChange={ handleFeatureSelect } style={{ width: '100%' }}>
          { features.map(feature => <Select.Option key={ `feature-option-${ feature }` } value={ feature }>{ feature }</Select.Option>) }
        </Select>
      </Col>
    </Row>
  )
}
