import React, { Fragment } from 'react'
import { Typography } from 'antd'
import { ImageViewer } from '../components/image-viewer'

const { Title } = Typography

export const MapView = () => {
  return (
    <Fragment>
      <Title level={ 1 }>Map</Title>
      
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
      </p>

    </Fragment>
  )
}
