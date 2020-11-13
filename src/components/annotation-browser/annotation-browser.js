import React, { useState, useContext, useReducer } from 'react'
import { Form, Space, Select, InputNumber, Button, Spin, Alert, notification } from 'antd'
import axios from 'axios'
import { AnnotationsContext } from '../../contexts'
import { AnnotationPanel } from '../annotation-panel'
import { api, views } from '../../api'
import './annotation-browser.css'

const { Option } = Select

export const AnnotationBrowser = () => {
  const [allAnnotations] = useContext(AnnotationsContext)
  const [annotation, setAnnotation] = useState(null)
  const [numLoad, setNumLoad] = useState(5)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)

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
            present: {
              left: false,
              front: false,
              right: false
            }
          }
        ]        

      case 'toggleAnnotationPresent': {
        const newState = [...state]

        const index = newState.findIndex(({ id }) => id === action.id)

        if (index === -1) return newState

        const present = { ...newState[index].present }
        present[action.which] = !present[action.which]

        newState[index] = {
          ...newState[index],
          present: present
        }

        return newState
      }
  
      default: 
        throw new Error('Invalid images action: ' + action.type)
    }
  }, [])

  const getImages = async value => {
    setLoading(true)

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

      setLoading(false)
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

  const handleClick = (id, which) => {
    imagesDispatch({
      type: 'toggleAnnotationPresent',
      id: id,
      which: which
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
            is_present: present.left || present.front || present.right,
            is_present_views: Object.entries(present).filter(([,value]) => value).map(([key,]) => views[key]),
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
              <Option key={ i } value={ annotation }>
                { annotation }
              </Option>
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
      { loading ? 
        <Spin className='spin' /> : annotation ?
        <Space direction='vertical' className='panels'>  
          <Alert message={ 
            <>Select <strong>left</strong> and <strong>right</strong> images containing: <strong>{ annotation }</strong></> 
          } />          
          { images.map((image, i) => (
            <AnnotationPanel 
              key={ i } 
              image={ image } 
              annotation={ annotation }
              handleClick={ handleClick } />
          ))}
        </Space> 
      : null }  
    </>
  )
}