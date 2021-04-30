import React from 'react'
import { Typography } from 'antd'
import { useRouteBrowseContext } from './context'

const { Paragraph } = Typography

export const SceneMetadata = () => {
  const { currentLocation, imageIDs, index, routeID } = useRouteBrowseContext()
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '80%', opacity: 0.75 }}>
      <Paragraph style={{ textAlign: 'left' }}>
        { index + 1 } of { imageIDs.length }<br />
        Image ID: { imageIDs[index] || '...' } <br />
        Route ID: { routeID || '...' } <br />
      </Paragraph>
      <Paragraph style={{ textAlign: 'right' }}>
        Latitude: { currentLocation.lat || '...' }<br />
        Longitude: { currentLocation.long || '...' }<br />
      </Paragraph>
    </div>
  )
}
