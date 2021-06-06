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

  return (
    <List
      bordered
      className="predictions-list"
      dataSource={ Object.values(currentLocation.features) }
      renderItem={ feature => {
        return (
          <pre key={ feature.key } style={{ fontSize: '75%' }}>
            { JSON.stringify(feature, null, 2) }
          </pre>
        )
      }}
    />
  )
}