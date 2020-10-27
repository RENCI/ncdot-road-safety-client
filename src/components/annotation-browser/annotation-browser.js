import React, { useState, useContext } from 'react'
import { Form, Space, Select } from 'antd'
import axios from 'axios'
import { AnnotationsContext } from '../../contexts'
import { AnnotationPanel } from '../annotation-panel'
import { api } from '../../api'
import './annotation-browser.css'

const imageCount = 10

export const AnnotationBrowser = () => {
  const [allAnnotations] = useContext(AnnotationsContext)
  const [annotation, setAnnotation] = useState(null)
  const [images, setImages] = useState([])

  const handleChange = async value => {
    setAnnotation(value)

    try {
      const result = await axios.get(api.getNextImageNamesForAnnotation(value, imageCount))

      setImages([...result.data.image_base_names])
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Form>         
        <Form.Item label='Select annotation'>
          <Select
            placeholder='Select annotation'
            value={ annotation } 
            onChange={ handleChange }
          >
            { allAnnotations.map((annotation, i) => (
              <Select.Option key={ i } value={ annotation.id }>
                { annotation.label }
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

      <Space direction='vertical'>
        { images.map((id, i) => (
          <AnnotationPanel key={ i } id={ id } annotation={ annotation } />
        ))}        
      </Space>
    </>
  )
}