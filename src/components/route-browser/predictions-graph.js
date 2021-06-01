import React, { useEffect, useState } from 'react'
import { Col, Row } from 'antd'
import { useRouteContext } from './context'
import { api } from '../../api'
import { ResponsiveLine } from '@nivo/line'

const tester = [
  {
    "id": "guardrail",
    "color": "hsl(346, 70%, 50%)",
    "data":  [
      { "x": "1", "y": 0.141 },
      { "x": "2", "y": 0.207 },
      { "x": "3", "y": 0.241 },
      { "x": "4", "y": 0.176 },
      { "x": "5", "y": 0.194 },
      { "x": "6", "y": 0.216 },
      { "x": "7", "y": 0.92 },
      { "x": "8", "y": 0.133 },
      { "x": "9", "y": 0.278 },
      { "x": "10", "y": 0.197 },
      { "x": "11", "y": 0.51 },
      { "x": "12", "y": 0.26 },
    ]
  }
]

/**
  TODO:
  - fetch the feature ids for the keys in the `initialPredictions` object below
  */
const features = ['guardrail', 'pole']

// from the above array, construct an empty predictions object
// that looks like this { guardrail: {}, pole: {}, ... }
const initialPredictions = features.reduce((obj, key) => ({ ...obj, [key]: {} }), {})

const Summary = () => {
  return (
    <div className="predictions-summary placeholder">
      Summary
    </div>
  )
}

const Graph = () => {
  const { routeID } = useRouteContext()
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRoutePredictions = async () => {
      try {
        const { data: { route_image_info } } = await api.getRoutePredictionInfo(routeID, 'guardrail')
        if (!route_image_info) { return }
        const preds = await route_image_info.map(info => ({
          x: info.mile_post,
          y: info.aiimageannotation__certainty,
        }))
        setPredictions(preds)
      } catch (error) {
        console.log(error)
      }
      setLoading(false)
    }
    fetchRoutePredictions()
  }, [routeID])

  if (loading || !predictions) {
    return 'Loading predictions...'
  }

  return predictions && (
    <div className="predictions-graph placeholder">
      <ResponsiveLine
        data={tester} // this is test data from above
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: 1, stacked: false, reverse: false }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{ orient: 'bottom', tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'transportation', legendOffset: 36, legendPosition: 'middle' }}
        axisLeft={{ orient: 'left', tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'count', legendOffset: -40, legendPosition: 'middle' }}
        pointSize={2}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointLabelYOffset={-12}
        useMesh={true}
      />
    </div>
  )
}

export const PredictionsGraph = ({ key }) => {
  return (
    <Row gutter={ 32 }>
      <Col xs={ 24 } lg={ 18 }>
        <Graph />
      </Col>
      <Col xs={ 24 } lg={ 6 }>
        <Summary />
      </Col>
    </Row>
  )
}
