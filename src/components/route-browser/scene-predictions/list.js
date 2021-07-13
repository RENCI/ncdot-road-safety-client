import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useRouteContext } from '../context'
import { api } from '../../../api'
import { Card, Space, Typography } from 'antd'
import './list.css'

const { Text } = Typography

export const PredictionsList = ({ features }) => {
  return (
    <Card className="predictions-scatterplot__tooltip">
      <Space direction="vertical">
        {
          ['guardrail', 'pole'].map((feature, i) => (
            <Space direction="vertical">
              <Text strong>{ features[feature].name }</Text>
              <Text>- Annotation: <Text type="secondary">{ features[feature].annotation === true ? 'Present' : 'Absent' }</Text></Text>
              <Text>- Probability: <Text type="secondary">{ features[feature].probability }</Text></Text>
              <br/>
            </Space>
          ))
        }
      </Space>
    </Card>
  )
}

PredictionsList.propTypes = {
  features: PropTypes.array.isRequired,
}
