import React, { useEffect, useState } from 'react'
import { useRouteBrowseContext } from './context'
import { api } from '../../api'
import { Card, Table, Typography } from 'antd'
import {
  CheckOutlined as TrueIcon,
  CloseOutlined as FalseIcon,
} from '@ant-design/icons'

const { Text } = Typography

// todo: fetch the feature ids for this object's keys
const features = ['guardrail', 'pole']
// from the above array, construct this object: { guardrail: {}, pole: {}, ... }
const initialPredictions = features.reduce((obj, key) => ({ ...obj, [key]: {} }), {})

export const Prediction = () => {
  const { currentLocation } = useRouteBrowseContext()
  const [predictions, setPredictions] = useState(initialPredictions)
  const [tableData, setTableData] = useState([])

  const columns = [
    { title: 'Feature',     dataIndex: 'feature',     key: 'feature' },
    { title: 'Probability', dataIndex: 'probability', key: 'probability' },
    { title: 'Presence',    dataIndex: 'presence',    key: 'presence',
      render: presence => presence === true ? <TrueIcon style={{ color: 'green' }} /> : <FalseIcon style={{ color: 'red' }} />
    },
  ]

  useEffect(() => {
   if (currentLocation.id) {
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
    }
  }, [currentLocation])

  return (
    <Card title="Predictions">
      <Table
        columns={ columns }
        dataSource={ tableData }
        pagination={ false }
      />
    </Card>
  )
}