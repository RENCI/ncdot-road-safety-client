import React, { useEffect, useState } from 'react'
import { useRouteBrowseContext } from './context'
import { api } from '../../api'
import { Card, List, Table, Typography } from 'antd'
import {
  CheckOutlined as TrueIcon,
  CloseOutlined as FalseIcon,
} from '@ant-design/icons'
import './predictions.css'

const { Meta, Text } = Typography

/**
  TODO:
  - fetch the feature ids for the keys in the `features` object below
  */
const features = ['guardrail', 'pole']
// from the above array, construct this object: { guardrail: {}, pole: {}, ... }
const initialPredictions = features.reduce((obj, key) => ({ ...obj, [key]: {} }), {})

export const Predictions = ({ key }) => {
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
  }, [currentLocation, key])

  if (loading || !predictions) {
    return 'Loading predictions...'
  }

  return predictions && (
    <List
      dataSource={ predictions }
      renderItem={ item => {
        console.log(item)
        const { key, feature, presence, probability } = item
        const description = presence === true
          ? <Text><TrueIcon style={{ color: '#5c9', margin: 'auto' }} /> &nbsp; { probability }</Text>
          : <Text><FalseIcon style={{ color: '#c55', margin: 'auto' }} /> &nbsp; { probability }</Text>
        return (
          <List.Item key={ `prediction-${ currentLocation.id }-${ key }` }>
            <List.Item.Meta title={ feature } description={ description } />
          </List.Item>
        )
      }}
    />
  )
}