import React, { useState, useContext, useEffect } from 'react'
import { Form, Select, Button, notification } from 'antd'
import axios from 'axios'
import { AnnotationsContext, RouteBrowserContext } from '../../contexts'
import { api } from '../../api'
import './annotation-controls.css'

const { Option } = Select

export const AnnotationControls = () => {
  const [saving, setSaving] = useState(false)
  const [saveEnabled, setSaveEnabled] = useState(true)
  const [annotations, setAnnotations] = useState([])
  const [annotationTypes] = useContext(AnnotationsContext)
  const [image] = useContext(RouteBrowserContext)

  useEffect(() => {
    const annotations = image.annotations.map(({ annotation_name }) => annotation_name)

    setAnnotations([...annotations])
  }, [image])

  const handleSelectChange = values => { 
    setAnnotations([...values])
    setSaveEnabled(true)
  }

  const handleSaveClick = async () => {    
    try {     
      setSaving(true);

      axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
      axios.defaults.xsrfCookieName = 'csrftoken'

      // XXX: Not handling "false" annotations   
      await axios.post(api.saveAnnotations, {
        annotations: annotations.map(annotation => {
          return {
            image_base_name: image.id,
            annotation_name: annotation,
            is_present: true,
            comment: 'test'
          }
        })
      })

      setSaving(false)
      setSaveEnabled(false)

      notification.success({
        message: 'Annotations saved',
        placement: 'bottomLeft',
        duration: 2
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <h3>Annotations</h3>
      <Form>
        <Form.Item>
          <Select
            showSearch
            allowClear
            mode='multiple'
            placeholder="Add an annotation"
            optionFilterProp="children"
            value={ annotations }
            onChange={ handleSelectChange }
          >
            { annotationTypes.map(({ name }, i) => (
              <Option key={ i } value={ name }>
                { name }
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button 
            type='primary'
            loading={ saving }
            disabled={ !saveEnabled }
            onClick={ handleSaveClick }
          >
            Save
          </Button>
        </Form.Item>
     </Form>
    </>
  )
}