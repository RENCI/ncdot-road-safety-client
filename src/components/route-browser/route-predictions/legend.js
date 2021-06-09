import React from 'react'
import { Typography } from 'antd'

const { Text } = Typography

const features = ['guardrail', 'pole']

export const Legend = () => {
  const colors = [
    { color: `var(--color-present)`, description: `Present` },
    { color: `var(--color-irrelevant)`, description: `Irrelevant` },
    { color: `var(--color-absent)`, description: `Absent` },
    { color: `var(--color-not-annotated)`, description: `Not Annotated` },
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