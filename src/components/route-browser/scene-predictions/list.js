import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useRouteContext } from '../context'
import { api } from '../../../api'
import { Card, Space, Typography } from 'antd'
import './list.css'

const { Text } = Typography

export const PredictionsList = ({ features }) => {
  return (
    <Space direction="vertical">
      {
        ['guardrail', 'pole'].map((feature, i) => (
          <Space key={ i } direction="vertical">
            <Text strong>{ features[feature].name }</Text>
            <Text>- Annotation: <Text type="secondary">{ typeof features[feature].annotation === 'boolean' ? features[feature].annotation ? 'Present' : 'Absent' : 'N/A' }</Text></Text>
            <Text>- Probability: <Text type="secondary">{ features[feature].probability }</Text></Text>
            <br/>
          </Space>
        ))
      }
    </Space>
  )
}

PredictionsList.propTypes = {
  features: PropTypes.object.isRequired,
}
