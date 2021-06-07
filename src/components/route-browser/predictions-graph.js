import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Col, Row, Switch, Typography } from 'antd'
import {
  LikeOutlined as ThumbsUpIcon,
  DislikeOutlined as ThumbsDownIcon,
} from '@ant-design/icons'
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
    <div className="predictions-graph__tooltip">
      <Text>image { node.data.x }</Text><br/>
      <Text>{ node.data.y >= 0.5 ? <ThumbsUpIcon /> : <ThumbsDownIcon /> } { node.data.y }</Text><br/>
      <pre style={{ fontSize: '50%' }}>
        { JSON.stringify(node, null, 2) }
      </pre>
    </div>
  )
}

const CustomNode = ({ node, x, y, size, color, blendMode, onMouseEnter, onMouseMove, onMouseLeave, onClick }) => {
  const { imageIndex, images } = useRouteContext()
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(+imageIndex - 1 === node.data.x)
  }, [imageIndex])

  return (
    <Fragment>
      <g transform={`translate(${ x },${ y })`}>
        {
          active && (
            <circle className="active-pulse" r={ size } fill={ 'teal' } style={{ mixBlendMode: blendMode }}>
              <animate attributeName="r" begin="0s" dur="1s" repeatCount="indefinite" from="0" to="10"/>
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
      { active && <path d={ `M${ x } 0,${ x } 200` } stroke="#00000099" strokeWidth="0.25" strokeDasharray="5,5" /> }
      { active && <path d={ `M0 ${ y },1000 ${ y }` } stroke="#00000099" strokeWidth="0.25" strokeDasharray="5,5" /> }
    </Fragment>
  )
}

const Graph = ({ data }) => {
  const history = useHistory()
  const { currentLocation, images, routeID } = useRouteContext()
  
  const handlePointClick = (node, event) => {
    if (node) {
      history.push(`/routes/${ routeID }/${ +node.data.x + 1 }`)
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
  const [data, setData] = useState([])
  const [selectedFeatures, setSelectedFeatures] = useState([])

  // massage prediction data into a format usable by this Nivo graph component.
  useEffect(() => {
    const predictions = { ...initialData }
    images.forEach((image, i) => {
      features.forEach(feature => {
        if (image.features[feature]) {
          predictions[feature].data.push({ x: i + 1, y: image.features[feature].probability, image })
        } //else {
        //   predictions[feature].data.push({ x: i, y: -1 })
        // }
      })
    })
    setData(Object.values(predictions))
  }, [images])

  const handleToggleFeatureSelection = feature => event => {
    let newSelection = new Set(selectedFeatures)
    if (newSelection.has(feature)) {
      newSelection.delete(feature)
    } else {
      newSelection.add(feature)
    }
    setSelectedFeatures([...newSelection])
  }

  const selectedData = useMemo(() => {
    if (data) {
      return data.filter(datum => selectedFeatures.includes(datum.id))
    }
  }, [data, selectedFeatures])

  return (
    <Row gutter={ 32 }>
      <Col xs={ 24 } lg={ 18 }>
        <Graph data={ selectedData } />
      </Col>
      <Col xs={ 24 } lg={ 6 }>
        {
          features.map(feature => (
            <div>
              <Switch checked={ selectedFeatures.includes(feature) } onChange={ handleToggleFeatureSelection(feature) } />
              &nbsp;{ feature }
            </div>
          ))
        }
      </Col>
    </Row>
  )
}
