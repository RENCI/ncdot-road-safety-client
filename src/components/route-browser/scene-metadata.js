import React from 'react'
import { Typography } from 'antd'
import { useRouteContext } from './context'
import './scene-metadata.css'

const { Paragraph, Text } = Typography

export const SceneMetadata = () => {
  const { currentLocation, imageIDs, index, routeID } = useRouteContext()
  return (
    <div className="scene-metadata">
      <Paragraph style={{ textAlign: 'left' }}>
        Image ID: <Text copyable>{ imageIDs[index] || '...' }</Text> <br />
        Route ID: <Text copyable>{ routeID || '...' }</Text> <br />
        { index + 1 } of { imageIDs.length }
      </Paragraph>
      <Paragraph style={{ textAlign: 'right' }}>
        Latitude: { currentLocation.lat || '...' }<br />
        Longitude: { currentLocation.long || '...' }<br />
        Distance along route: { currentLocation.distance || '...' }
      </Paragraph>
    </div>
  )
}
