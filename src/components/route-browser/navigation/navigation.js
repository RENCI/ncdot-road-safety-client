import React from 'react'
import { Space } from 'antd'
import { NavigationButtons } from './navigation-buttons'
import { NavigationSlider } from './navigation-slider'
import './navigation.css'

export const RouteNavigation = () => {
  return (
      <Space className="route-navigation">
        <NavigationButtons />
        <NavigationSlider />
      </Space>
  )
}
