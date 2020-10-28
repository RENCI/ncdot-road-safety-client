import React from 'react'
import { Typography } from 'antd'
import { AnnotationBrowser } from '../components/annotation-browser'

const { Title } = Typography

export const BrowseAnnotationView = () => {
  return (
    <>
      <Title level={ 1 }>Browse by Annotation</Title>

      <AnnotationBrowser />
    </>
  )
}
