import React from 'react'
import { Typography } from 'antd'
import { useAnomalies } from '../contexts'
import { AnomalyList } from '../components/anomaly-list'

const { Title } = Typography

export const AnomalyListView = () => {
  return (
    <>
      <Title level={ 1 }>Browse Anomalies</Title>

      <AnomalyList />
    </>
  )
}
