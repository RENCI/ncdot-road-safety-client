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

export const PredictionsList = () => {
  const { currentLocation } = useRouteContext()
  const [predictions, setPredictions] = useState()

  useEffect(() => {
    if (currentLocation.features) {
      setPredictions(Object.values(currentLocation.features))
    }
  }, [currentLocation.features])

  if (!predictions) {
    return 'Loading predictions...'
  }

  return predictions && (
    <List
      bordered
      className="predictions-list"
      dataSource={ predictions }
      renderItem={ item => {
        return (
          <pre key={ item.key } style={{ fontSize: '75%' }}>
            { JSON.stringify(item, null, 2) }
          </pre>
        )
      }}
    />
  )
}