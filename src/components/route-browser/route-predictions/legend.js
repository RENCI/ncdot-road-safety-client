import React from 'react'
import { Typography } from 'antd'

const { Text } = Typography

const features = ['guardrail', 'pole']

export const Legend = () => {
  const colors = [
    { color: `var(--color-positive)`, description: `Present` },
    { color: `var(--color-neutral)`, description: `No Annotation` },
    { color: `var(--color-negative)`, description: `Absent` },
  ]
  return (
    <div className="legend">
      {
        colors.map(item => (
          <div key={ `legend-item_${ item.color }` } className="legend-item">
            <Text style={{ color: item.color }}>●</Text> <Text>{ item.description }</Text>
          </div>
        ))
      }
    </div>
  )
}