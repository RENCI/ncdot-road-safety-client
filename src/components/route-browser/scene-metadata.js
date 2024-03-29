import React from 'react'
import { Typography } from 'antd'
import { useRouteContext } from './context'
import './scene-metadata.css'

const { Paragraph, Text } = Typography

export const SceneMetadata = () => {
  const { currentLocation, routeLength, images, index, routeID } = useRouteContext()
  return (
    <div className="scene-metadata">
      <Paragraph style={{ textAlign: 'left' }}>
        Image ID: <Text copyable>{ images[index]?.image_base_name || '...' }</Text> <br />
        Route ID: <Text copyable>{ routeID || '...' }</Text> <br />
        { index + 1 } of { images.length }
      </Paragraph>
      <Paragraph style={{ textAlign: 'right' }}>
        Latitude: { currentLocation.location ? currentLocation.location.lat : '...' }<br />
        Longitude: { currentLocation.location ? currentLocation.location.long : '...' }<br />
        Distance along route:
          &asymp; { currentLocation.mile_post ? currentLocation.mile_post.toFixed(3) : '...' } mi
          &nbsp;/&nbsp;{ routeLength.toFixed(3) } mi
      </Paragraph>
    </div>
  )
}
