import React, { useState, useContext, useReducer } from 'react'
import { Form, Space, Select, InputNumber, Button, notification } from 'antd'
import axios from 'axios'
import { AnnotationsContext } from '../../contexts'
import { AnnotationPanel } from '../annotation-panel'
import { api } from '../../api'
import './annotation-browser.css'

export const AnnotationBrowser = () => {
  const [allAnnotations] = useContext(AnnotationsContext)
  const [annotation, setAnnotation] = useState(null)
  const [numLoad, setNumLoad] = useState(5)
  const [saving, setSaving] = useState(false)

  const [images, imagesDispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'clearImages':
        return []

      case 'addImage':     
        return [
          ...state, {
            id: action.id,
            metadata: action.metadata,
            annotations: action.annotations,
            present: false
          }
        ]

      case 'setAnnotationPresent': {
        const newState = [...state]

        const index = newState.indexOf(({ id }) => id === action.id)

        newState[index] = {
          ...newState[index],
          present: action.present
        }

        return newState
      }        
  
      default: 
        throw new Error('Invalid images action: ' + action.type)
    }
  }, [])

  const getImages = async value => {
    imagesDispatch({ type: 'clearImages' })

    try {
      const result = await axios.get(api.getNextImageNamesForAnnotation(value, numLoad))

      const baseNames = result.data.image_base_names

      for (const id of baseNames) {
        const annotationsResult = await axios.get(api.getImageAnnotations(id))
        const metadataResult = await axios.get(api.getImageMetadata(id))

        // XXX: Do we want to get the annotations/metadata for this view?
        imagesDispatch({ 
          type: 'addImage', 
          id: id,
          annotations: annotationsResult.data.annotations,
          metadata: metadataResult.data.metadata
        })
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleAnnotationChange = value => {
    setAnnotation(value)

    getImages(value)
  }

  const handleNumLoadChange = value => {
    setNumLoad(value)
  }

  const handlePresentChange = (id, checked) => {
    imagesDispatch({
      type: 'setAnnotationPresent',
      id: id,
      present: checked
    })
  }

  const handleGetNewImagesClick = () => {
    getImages(annotation)
  }

  const handleSaveClick = async () => {
    try {     
      setSaving(true);

      axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
      axios.defaults.xsrfCookieName = 'csrftoken'
   
      await axios.post(api.saveAnnotations, {
        annotations: images.map(({ id, present }) => {
          return {
            image_base_name: id,
            annotation_name: annotation,
            is_present: present,
            comment: 'test'
          }
        })
      })

      setSaving(false)

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
      <Form>         
        <Form.Item label='Select annotation'>
          <Select
            placeholder='Select annotation'
            value={ annotation } 
            onChange={ handleAnnotationChange }
          >
            { allAnnotations.map((annotation, i) => (
              <Select.Option key={ i } value={ annotation.id }>
                { annotation.label }
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label='Number of images:'>
          <InputNumber
            min={ 1 } 
            max={ 20 }
            value={ numLoad }
            onChange={ handleNumLoadChange } />
        </Form.Item>
        <Form.Item>
          <Button 
            type='primary' 
            loading={ saving }
            disabled={ !annotation }
            onClick={ handleSaveClick }>
            Save
          </Button>
          <Button  
            disabled={ !annotation }
            onClick={ handleGetNewImagesClick }>
            Get new images
          </Button>
        </Form.Item>
      </Form>

      <Space direction='vertical'>
        { images.map((image, i) => (
          <AnnotationPanel 
            key={ i } 
            image={ image } 
            annotation={ annotation }
            handleChange={ checked => handlePresentChange(image.id, checked) } />
        ))}        
      </Space>


    </>
  )
}