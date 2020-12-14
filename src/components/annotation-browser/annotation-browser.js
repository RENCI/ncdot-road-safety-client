import React, { useState, useContext, Fragment } from 'react'
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

  const { images, nextImages, numLoad, annotation } = {...state}

  const getNewImages = async annotation => {
    setLoading(true)

    try {
      const response = await axios.get(api.getNextImageNamesForAnnotation(annotation, numLoad * 2))
      
      dispatch({ 
        type: 'setImages', 
        ids: response.data.image_base_names.slice(0, numLoad),
        nextIds: response.data.image_base_names.slice(-numLoad) 
      })

      setLoading(false)  
    }
    catch (error) {
      console.log(error)
    }  
  }  

  const updateImages = async () => {
    dispatch({ type: 'updateImages' })

    // Get next images, but don't wait for them
    // XXX: Would be more efficient to get next images returned in save response
    axios.get(api.getNextImageNamesForAnnotation(annotation, numLoad * 2))
      .then(response => {
        dispatch({ 
          type: 'setNextImages', 
          ids: response.data.image_base_names.slice(-numLoad) 
        }) 
      })
      .catch(error => {
        console.log(error)
      }) 
  }

  const handleAnnotationChange = value => {
    dispatch({ type: 'setAnnotation', annotation: value })

    getNewImages(value)
  }

  const handleNumLoadChange = value => {
    dispatch({ type: 'setNumLoad', numLoad: value })

    // XXX: Need to handle update for this
  }

  const handleClick = (id, which) => {
    dispatch({
      type: 'toggleAnnotationPresent',
      id: id,
      which: which
    })
  }

  const handleSaveClick = async () => {    
    setSaving(true);

    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
    axios.defaults.xsrfCookieName = 'csrftoken'

    try {
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

      images.length === nextImages.length ? updateImages() : getNewImages(annotation)
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
      { nextImages.map(({ id }, i) => (
        <Fragment key={ i }>
          <link rel='prefetch' href={ api.getImage(id, 'left') } />
          <link rel='prefetch' href={ api.getImage(id, 'front') } />
          <link rel='prefetch' href={ api.getImage(id, 'right') } />
        </Fragment>
      ))}
    </>
  )
}