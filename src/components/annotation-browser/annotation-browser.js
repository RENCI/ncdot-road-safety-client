import React, { useState, useContext, useRef, useEffect, Fragment } from 'react'
import { Form, Space, Select, InputNumber, Button, Spin, Alert, notification } from 'antd'
import { CloudUploadOutlined, ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import { AnnotationsContext, AnnotationBrowserContext } from '../../contexts'
import { AnnotationPanel } from '../annotation-panel'
import { api, views } from '../../api'
import './annotation-browser.css'

const { Option } = Select

export const AnnotationBrowser = () => {
  const [annotationTypes] = useContext(AnnotationsContext)
  const [state, dispatch] = useContext(AnnotationBrowserContext)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const saveButton = useRef(null)

  const { images, nextImages, oldImages, numLoad, annotation } = {...state}

  const cacheSize = numLoad * 4;

  const getNextImages = (annotation, offset, numImages) => {
    // Get next images, but don't wait for them
    axios.get(api.getNextImageNamesForAnnotation(annotation, numImages), {
      params: { offset: offset }
    }).then(response => {     
        dispatch({ 
          type: 'addNextImages', 
          ids: response.data.image_base_names
        }) 
      })
      .catch(error => {
        console.log(error)
      })
  }

  const getNewImages = async annotation => {
    setLoading(true)

    // Start loading cache
    getNextImages(annotation, numLoad, cacheSize);

    try {
      const response = await axios.get(api.getNextImageNamesForAnnotation(annotation, numLoad))
      
      dispatch({ 
        type: 'setImages', 
        ids: response.data.image_base_names
      })

      setLoading(false)  
    }
    catch (error) {
      console.log(error)
    }  
  }  

  const updateImages = async () => {
    dispatch({ type: 'updateImages' })

    getNextImages(annotation, cacheSize, numLoad)
  }

  const handleAnnotationChange = value => {
    const annotation = annotationTypes.find(({ name }) => name === value)

    dispatch({ type: 'setAnnotation', annotation: annotation })

    getNewImages(value)
  }

  useEffect(() => {
    if (annotationTypes.length > 0) {
      handleAnnotationChange(annotationTypes[0].name)
    } 
  }, [annotationTypes])

  const handleNumLoadChange = value => {
    dispatch({ type: 'setNumLoad', numLoad: value })
  }

  const handleBackClick = async () => {
    dispatch({ type: 'goBack' })
  }

  const handleSaveClick = async () => {    
    setSaving(true);

    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
    axios.defaults.xsrfCookieName = 'csrftoken'

    try {
      await axios.post(api.saveAnnotations, {
        annotations: images.map(({ id, present, flags }) => {
          // XXX: Split flags and comments here


          return {
            image_base_name: id,
            annotation_name: annotation,
            views: {...present},
            flags: [...flags]
          }
        })
      })
      
      setSaving(false)

      notification.success({
        message: 'Annotations saved',
        placement: 'bottomLeft',
        duration: 2
      })

      images.length <= nextImages.length ? updateImages() : getNewImages(annotation)

      saveButton.current.focus()
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleKeyPress = event => {
    if (event.key === 'Enter' || event.key === 's') {
      handleSaveClick()
    }
  }

  const saveButtonGroup = (
    <div className='buttonBox'>
      <Button
        className='iconButton'
        type='primary'
        ghost
        htmlType='button'
        disabled={ oldImages.length === 0 }
        size='large'      
        icon={ <ArrowLeftOutlined /> }
        onClick={ handleBackClick } />
      <Button               
        className='iconButton saveButton' 
        ref={ saveButton }
        type='primary' 
        htmlType='submit'
        loading={ saving }
        disabled={ !annotation }
        size='large'                
        icon={ <CloudUploadOutlined /> }
        onClick={ handleSaveClick }>
          Save and advance
      </Button>
    </div>
  )

  return (
    <>
      <Form 
        onKeyPress={ handleKeyPress }
      >         
        <Form.Item label='Select annotation'>
          <Select
            placeholder='Select annotation'
            value={ annotation ? annotation.name : ''} 
            onChange={ handleAnnotationChange }
          >
            { annotationTypes.map(({ name }, i) => (
              <Option key={ i } value={ name }>
                { name }
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
                <div className='helpMessageDiv'>
                  <div className='helpMessage'>
                    Select <strong>left</strong>, <strong>front</strong>, and <strong>right</strong> images containing: <strong>{ annotation.name }</strong>
                  </div> 
                  <Button
                    className='iconButton'
                    type='link'
                    href='https://docs.google.com/document/d/1-CeqPD1b1cFyMjwYivoBlRXfQp-IuHPBP_sWTLoHHXg/edit?usp=sharing'
                    icon={ <QuestionCircleOutlined style={{ fontSize: 'large' }} /> }
                  />
                </div>
              } /> 
            </Form.Item>
            <Form.Item>
              { saveButtonGroup }
            </Form.Item>
          </> }
      { loading ?  
          <Spin className='spin' tip='Loading...' /> : 
        annotation ?
          <Form.Item>
            <Space direction='vertical' size='middle' className='panels'>            
              { images.map((image, i) => (
                <AnnotationPanel 
                  key={ i } 
                  image={ image } 
                  flagOptions={ annotation.flags } />
              ))}
            </Space> 
          </Form.Item>
      : null } 
      { annotation && 
        <Form.Item>
          { saveButtonGroup }
        </Form.Item>
       }
      </Form> 
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