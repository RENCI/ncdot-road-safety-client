import React from 'react'
import { Typography } from 'antd'
import { RouteBrowser } from '../components/route-browser'

const { Title } = Typography

export const BrowseRouteView = () => {
  return (
    <>
      <Title level={ 1 }>Browse By Route</Title>

      <RouteBrowser />
    </>
  )
}
