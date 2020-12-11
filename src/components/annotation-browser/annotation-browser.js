import React, { useState, useContext } from 'react'
import { Form, Space, Select, InputNumber, Button, Spin, Alert, notification } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import axios from 'axios'
import { AnnotationsContext, AnnotationBrowserContext } from '../../contexts'
import { AnnotationPanel } from '../annotation-panel'
import { api, views } from '../../api'
import './annotation-browser.css'

const { Option } = Select

export const AnnotationBrowser = () => {
  const [allAnnotations] = useContext(AnnotationsContext)
  const [state, dispatch] = useContext(AnnotationBrowserContext)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)

  const { images, numLoad, annotation } = {...state}

  const getImages = async value => {
    setLoading(true)

    dispatch({ type: 'clearImages' })

    try {
      const result = await axios.get(api.getNextImageNamesForAnnotation(value, numLoad))

      const baseNames = result.data.image_base_names

      for (const id of baseNames) {
        // XXX: Do we want to get the annotations/metadata for this view?
        //const annotationsResult = await axios.get(api.getImageAnnotations(id))
        //const metadataResult = await axios.get(api.getImageMetadata(id))

        dispatch({ 
          type: 'addImage', 
          id: id,
          //annotations: annotationsResult.data.annotations,
          //metadata: metadataResult.data.metadata
          annotations: [],
          metadata: {}
        })
      }

      setLoading(false)
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleAnnotationChange = value => {
    dispatch({ type: "setAnnotation", annotation: value })

    getImages(value)
  }

  const handleNumLoadChange = value => {
    dispatch({ type: "setNumLoad", numLoad: value })
  }

  const handleClick = (id, which) => {
    dispatch({
      type: 'toggleAnnotationPresent',
      id: id,
      which: which
    })
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

      getImages(annotation)
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
        { annotation && 
          <>
            <Form.Item>
              <Alert message={ 
                <>Select <strong>left</strong> and <strong>right</strong> images containing: <strong>{ annotation }</strong></> 
              } /> 
            </Form.Item>
            <Form.Item>
              <Button 
                type='primary' 
                loading={ saving }
                disabled={ !annotation }
                size='large'
                icon={ <DownloadOutlined /> }
                onClick={ handleSaveClick }>
                  Save and advance
              </Button>
            </Form.Item>
          </> }
      </Form>
      { loading ?  
          <Spin className='spin' tip='Loading...' /> : 
        annotation ?
          <Space direction='vertical' size='middle' className='panels'>            
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