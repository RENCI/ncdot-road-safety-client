import React, { useState } from 'react'
import { Typography, Form, Select } from 'antd'
import { AnnotationBrowser } from '../components/annotation-browser'
import { RouteBrowser } from '../components/route-browser'

const { Title } = Typography

export const BrowseView = () => {
  const [mode, setMode] = useState('annotation')

  const handleChange = value => {
    setMode(value)
  }

  return (
    <>
      <Title level={ 1 }>Browse</Title>

      <Form>         
        <Form.Item label='Browse by'>
          <Select onChange={ handleChange } value={ mode }>
            <Select.Option value='annotation'>Annotation</Select.Option>
            <Select.Option value='route'>Route</Select.Option>
          </Select>
        </Form.Item>
      </Form>

      { mode === 'annotation' ? 
        <AnnotationBrowser /> :
        <RouteBrowser />
      }
    </>
  )
}
