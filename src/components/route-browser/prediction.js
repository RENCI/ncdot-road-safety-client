import React, { useEffect, useState } from 'react'
import { useRouteBrowseContext } from './context'
import { api } from '../../api'
import { Card, Table, Typography } from 'antd'
import {
  CheckOutlined as TrueIcon,
  CloseOutlined as FalseIcon,
} from '@ant-design/icons'
import './prediction.css'

const { Text } = Typography

/**
  TODO:
  - fetch the feature ids for the keys in the `features` object below
  */
const features = ['guardrail', 'pole']
// from the above array, construct this object: { guardrail: {}, pole: {}, ... }
const initialPredictions = features.reduce((obj, key) => ({ ...obj, [key]: {} }), {})

export const Prediction = ({ key }) => {
  const { currentLocation } = useRouteBrowseContext()
  const [predictions, setPredictions] = useState(initialPredictions)
  const [tableData, setTableData] = useState([])

  const columns = [
    {
      title: 'Prediction',
      dataIndex: 'presence',
      key: 'presence',
      render: (text, record) => record.presence === true
        ? <Text><TrueIcon style={{ color: '#5c9', margin: 'auto' }} /> &nbsp;&nbsp; { record.feature }</Text>
        : <Text><FalseIcon style={{ color: '#c55', margin: 'auto' }} /> &nbsp;&nbsp; { record.feature }</Text>,
    },
    {
      title: 'Probability',
      dataIndex: 'probability',
      key: 'probability'
    },
  ]

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
        setTableData(data)
      })
      .catch(error => console.error(error))
  }, [currentLocation, key])

  return (
    <Table
      bordered
      columns={ columns }
      dataSource={ tableData }
      pagination={ false }
    />
  )
}