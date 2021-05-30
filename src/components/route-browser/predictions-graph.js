import React, { useEffect, useState } from 'react'
import { Col, Row } from 'antd'
import { useRouteBrowseContext } from './context'
import { api } from '../../api'
import { ResponseiveLine } from '@nivo/line'

/**
  TODO:
  - fetch the feature ids for the keys in the `features` object below
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
  const { currentLocation } = useRouteBrowseContext()
  const [predictions, setPredictions] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const promises = features.map(feature => api.getImagePrediction(currentLocation.id, feature))
    Promise.allSettled(promises)
      .then(responses => {
        const data = responses
          .filter(response => response.status === 'fulfilled')
          .map(response => {
            const { prediction } = response.value.data
            return {
              key: prediction.feature_name,
              feature: prediction.feature_name[0].toUpperCase() + prediction.feature_name.slice(1),
              probability: prediction.probability,
              presence: prediction.presence,
            }
          })
        setPredictions(data)
        setLoading(false)
      })
      .catch(error => console.error(error))
  }, [currentLocation])

  if (loading || !predictions) {
    return 'Loading predictions...'
  }

  return predictions && (
    <div className="predictions-graph placeholder">
      Predictions Graph
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
