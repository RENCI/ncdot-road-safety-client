import React from 'react'
import { Card, Typography } from 'antd'
import { useRouteContext } from '../context'

const { Text } = Typography

const features = ['guardrail', 'pole']

export const GraphTooltip = ({ node }) => {
  const { images } = useRouteContext()

  return (
    <Card
      title={ `#${ node.data.image.index } / ${ images.length }` }
      className="predictions-scatterplot__tooltip"
    >
      {
        features.map(feature => (
          <pre style={{ fontSize: '75%' }} key={ feature }>
            { JSON.stringify(node.data.image.features[feature], null, 2) }
          </pre>
        ))
      }
    </Card>
  )
}