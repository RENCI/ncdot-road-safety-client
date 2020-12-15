import React, { useState, useContext, useRef, useEffect, Fragment } from 'react'
import { Form, Space, Select, InputNumber, Button, Spin, Alert, notification } from 'antd'
import { CloudUploadOutlined } from '@ant-design/icons'
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
  const [caching, setCaching] = useState(false)
  const button = useRef(null)

  const { images, nextImages, numLoad, annotation } = {...state}

  const cacheSize = numLoad * 2;

  useEffect(() => {
    if (caching || !annotation) return;

    const n = images.length + nextImages.length;

    if (n >= cacheSize) {
      setCaching(false)
      return
    }

    // Get next images, but don't wait for them
    axios.get(api.getNextImageNamesForAnnotation(annotation, numLoad, {
      offset: n
    }))
      .then(response => {     
        dispatch({ 
          type: 'addNextImages', 
          ids: response.data.image_base_names
        }) 
      })
      .catch(error => {
        console.log(error)
      }) 

    setCaching(true);
  })

  const getNewImages = async annotation => {
    setLoading(true)

    try {
      const response = await axios.get(api.getNextImageNamesForAnnotation(annotation, numLoad))
      
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
  }

  const handleAnnotationChange = value => {
    dispatch({ type: 'setAnnotation', annotation: value })

    getNewImages(value)
  }

  const handleNumLoadChange = value => {
    dispatch({ type: 'setNumLoad', numLoad: value })
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

      button.current.focus()
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleKeyPress = event => {
    if (event.key == 'Enter') {
      handleSaveClick()
    }
  }

  return (
    <>
      <Form 
        onKeyPress={ handleKeyPress }
      >         
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
                ref={ button }
                type='primary' 
                htmlType='submit'
                loading={ saving }
                disabled={ !annotation }
                size='large'
                block
                icon={ <CloudUploadOutlined /> }
                onClick={ handleSaveClick }>
                  Save and advance
              </Button>
            </Form.Item>
          </> }
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
      </Form>
    </>
  )
}