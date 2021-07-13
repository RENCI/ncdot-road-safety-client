import React from 'react'
import { Card, Typography } from 'antd'
import { useRouteContext } from '../context'
import { PredictionsList } from '../scene-predictions/list'

const { Text } = Typography

const features = ['guardrail', 'pole']

export const GraphTooltip = ({ node }) => {
  const { images } = useRouteContext()
  
  return (
    <Card
      title={ `${node.data.x } / ${ images.length }` }
      className="predictions-scatterplot__tooltip"
    >
      <PredictionsList features={ node.data.image.features } />
    </Card>
  )
}
