import React, { useEffect, useState } from 'react'
import { Col, Row } from 'antd'
import { useRouteContext } from './context'
import { api } from '../../api'
import { ResponsiveLine } from '@nivo/line'

const tester = [
  {
    "id": "guardrail",
    "data":  [{ x: 1, y: 0.141 }, { x: 2, y: 0.207 }, { x: 3, y: 0.241 }, { x: 4, y: 0.176 }, { x: 5, y: 0.194 }, { x: 6, y: 0.216 }, { x: 7, y: 0.92 }, { x: 8, y: 0.133 }, { x: 9, y: 0.278 }, { x: 10, y: 0.197 }, { x: 11, y: 0.51 }, { x: 12, y: 0.26 }]
  },
  {
    "id": "pole",
    "data":  [{ x: 1, y: 0.278 }, { x: 2, y: 0.194 }, { x: 3, y: 0.241 }, { x: 4, y: 0.26 }, { x: 5, y: 0.51 }, { x: 6, y: 0.92 }, { x: 7, y: 0.216 }, { x: 8, y: 0.133 }, { x: 9, y: 0.197 }, { x: 10, y: 0.176 }, { x: 11, y: 0.207 }, { x: 12, y: 0.141 }]
  }
]

const features = ['guardrail', 'pole']

const initialData = features.reduce((obj, feature) => ({ ...obj, [feature]: { id: feature, data: [] } }), {})

const Summary = () => {
  return (
    <div className="predictions-summary placeholder">
      Summary
    </div>
  )
}

const Graph = ({ data }) => {
  return (
    <div className="predictions-graph placeholder">
      <ResponsiveLine
        data={ data }
        margin={{ top: 0, right: 8, bottom: 0, left: 8 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: 1, stacked: false, reverse: false }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        pointSize={2}
        pointBorderWidth={1}
        pointLabelYOffset={-12}
      />
    </div>
  )
}

export const PredictionsGraph = ({ key }) => {
  const { images } = useRouteContext()
  const [data, setData] = useState([])

  // massage prediction data into a format usable by this Nivo graph component.
  useEffect(() => {
    console.log('generating route predition data')
    const predictions = { ...initialData }
    images.forEach((image, i) => {
      features.forEach(feature => {
        if (image.features[feature]) {
          predictions[feature].data.push({ x: i, y: image.features[feature].probability})
        }
      })
    })
    setData(Object.values(predictions))
  }, [images])

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <Row gutter={ 32 }>
      <Col xs={ 24 } lg={ 18 }>
        <Graph data={ data } />
      </Col>
      <Col xs={ 24 } lg={ 6 }>
        <Summary />
      </Col>
    </Row>
  )
}
