import React from 'react'
import { Typography, Row, Col } from 'antd'
import { AnnotationBrowser } from '../components/annotation-browser'
import { RouteBrowser } from '../components/route-browser'

const { Title } = Typography

export const BrowseView = () => {
  return (
    <>
      <Title level={ 1 }>Browse</Title>
      <AnnotationBrowser />
    </>
  )
}
