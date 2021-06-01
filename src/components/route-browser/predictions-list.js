import React, { useEffect, useState } from 'react'
import { useRouteContext } from './context'
import { api } from '../../api'
import { Card, List, Table, Tooltip, Typography } from 'antd'
import {
  CheckOutlined as TrueIcon,
  CloseOutlined as FalseIcon,
  QuestionOutlined as UndeterminedIcon,
} from '@ant-design/icons'
import './predictions-list.css'

const { Meta, Text } = Typography

/**
  TODO:
  - fetch the feature ids.
  */
const features = ['guardrail', 'pole']

// from the above array, construct an empty predictions object
// that looks like this { guardrail: {}, pole: {}, ... }
const initialPredictions = features.reduce((obj, key) => ({ ...obj, [key]: {} }), {})

export const PredictionsList = () => {
  const { currentLocation } = useRouteContext()
  const [predictions, setPredictions] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // create promises for fetching predictions for all annotation features
    // when they all complete (resolved or rejected), we set the predictions variable,
    const promises = features.map(feature => api.getImagePrediction(currentLocation.id, feature))
    Promise.allSettled(promises)
      .then(responses => {
        const data = responses
          .map((response, i) => {
            console.log(response)
            if (response.status !== 'fulfilled') {
              return {
                key: features[i],
                feature: features[i][0].toUpperCase() + features[i].slice(1),
                probability: null,
                presence: null,
              }
            }
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
    <List
      bordered
      className="predictions-list"
      dataSource={ predictions }
      renderItem={ item => {
        const { key, feature, presence, probability } = item
        const description = (presence === true)
          ? <Text>
              <Tooltip title="Annotation: Positive"><TrueIcon style={{ color: 'teal', margin: 'auto' }} /></Tooltip> &nbsp; { probability }
            </Text>
          : (presence === false)
            ? <Text>
                <Tooltip title={ `Annotation: Negative` }><FalseIcon style={{ color: 'tomato', margin: 'auto' }} /></Tooltip> &nbsp; { probability }
              </Text>
            : <Text>
                <Tooltip title={ `Annotation: None` }><UndeterminedIcon style={{ color: '#bbb', margin: 'auto' }} /></Tooltip> &nbsp; { probability }
              </Text>
        return (
          <List.Item key={ `prediction-${ currentLocation.id }-${ key }` } className="predictions-list-item">
            <List.Item.Meta title={ feature } description={ description } />
          </List.Item>
        )
      }}
    />
  )
}