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
          <div>
            <Text key={ `legend-item_${ item.color }` } style={{ color: item.color }}>●</Text> { item.description }
          </div>
        ))
      }
    </div>
  )
}