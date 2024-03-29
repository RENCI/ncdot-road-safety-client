import React, { useState, useContext, useRef, useEffect, Fragment } from 'react'
import { Form, Space, Select, Row, Col, InputNumber, Button, Switch, Spin, Alert, notification } from 'antd'
import { CloudUploadOutlined, ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import { useAnnotations, AnnotationBrowserContext, useAccount } from '../../contexts'
import { AnnotationPanel } from '../annotation-panel'
import { AnnotationSummary } from '../annotation-summary'
import { api } from '../../api'
import './annotation-browser.css'
const { Option } = Select

const helpUrls = {
  guardrail: 'https://docs.google.com/document/d/1-CeqPD1b1cFyMjwYivoBlRXfQp-IuHPBP_sWTLoHHXg/edit?usp=sharing',
  pole: 'https://docs.google.com/document/d/1xI4JSE2ztOi-6vFBawKGWir6M4KambK5BaQY5iKXDu0/edit?usp=sharing'
}

export const AnnotationBrowser = () => {
  const user = useAccount()
  const [gotImages, setGotImages] = useState(false)
  const [annotationTypes] = useAnnotations()
  const [state, dispatch] = useContext(AnnotationBrowserContext)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const saveButton = useRef(null)

  const { 
    images, 
    previousImages, 
    imageCache, 
    numLoad, 
    annotation, 
    autoAdjust, 
    userFlags, 
    flagShortcuts 
  } = {...state}

  const cacheSize = numLoad * 4

  const done = gotImages && images.length === 0

  const getFirstImages = async annotation => {
    setLoading(true)

    try {
      const response = await axios.get(api.getNextImageNamesForAnnotation(annotation, numLoad))
      
      dispatch({ 
        type: 'setImages', 
        infoList: response.data.image_info_list
      })

      setLoading(false)  
      setGotImages(true)

      // Load cache
      getCacheImages(annotation);
    }
    catch (error) {
      console.log(error)
    }  
  } 

  const getCacheImages = annotation => {
    // Get next images, but don't wait for them
    axios.get(api.getNextImageNamesForAnnotation(annotation, cacheSize)).then(response => {
      dispatch({ 
        type: 'setCacheImages', 
        infoList: response.data.image_info_list
      }) 
    })
    .catch(error => {
      console.log(error)
    })
  } 

  const onAnnotationChange = value => {
    const annotation = annotationTypes.find(({ name }) => name === value)
    
    setGotImages(false)

    dispatch({ type: 'setAnnotation', annotation: annotation })
    dispatch({ type: 'clearImages' })

    getFirstImages(annotation.name)
  }

  useEffect(() => {
    if (annotationTypes.length > 0) {
      onAnnotationChange(annotationTypes[0].name)
    } 
  }, [annotationTypes])

  const onNumLoadChange = value => {
    dispatch({ type: 'setNumLoad', numLoad: value })
  }

  const onAutoAdjustChange = checked => {
    dispatch({ type: 'setAutoAdjust', autoAdjust: checked })
  }

  const onBackClick = async () => {
    dispatch({ type: 'goBack' })
  }

  const onSaveClick = async () => {
    setSaving(true);

    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
    axios.defaults.xsrfCookieName = 'csrftoken'

    try {
      const response = await axios.post(api.saveAnnotations, {
        return_image_count: numLoad,
        annotation_name: annotation.name,
        annotations: images.map(({ id, present, flags }) => {
          const systemFlags = flags.filter(flag => annotation.flags.includes(flag))
          const userFlags = flags.filter(flag => !annotation.flags.includes(flag))

          return {
            image_base_name: id,
            annotation_name: annotation.name,
            views: {...present},
            flags: systemFlags,
            comments: userFlags
          }
        })
      })
      
      setSaving(false)

      notification.success({
        message: 'Annotations saved',
        placement: 'bottomLeft',
        duration: 2
      })

      dispatch({ 
        type: 'setImages', 
        infoList: response.data.image_info_list
      })
      
      getCacheImages(annotation.name)

      user.refreshAnnotationDetails()

      if (saveButton.current) saveButton.current.focus()
    }
    catch (error) {
      setSaving(false)

      notification.error({
        message: 'Saving annotations failed',
        placement: 'bottomLeft',
        duration: 2
      })

      console.log(error)
    }
  }

  const onKeyDown = event => {
    if (event.target.nodeName.toLowerCase() === 'input') return

    switch (event.key) {
      case 'Enter': 
        onSaveClick()
        break
      
      case 'Backspace':
        onBackClick()
        break
    }
  }

  const SaveButtonGroup = ({ isFirst }) => (
    <div className='buttonBox'>
      <Button
        className='iconButton'
        type='primary'
        ghost
        htmlType='button'
        disabled={ previousImages.length === 0 }
        size='large'      
        icon={ <ArrowLeftOutlined /> }
        onClick={ onBackClick } />
      <Button               
        className='iconButton saveButton' 
        ref={ isFirst ? saveButton : null }
        type='primary' 
        loading={ saving }
        disabled={ !annotation }
        size='large'                
        icon={ <CloudUploadOutlined /> }
        onClick={ onSaveClick }>
          Save and advance
      </Button>
    </div>
  )

  return (
    <>
      <Form 
        onKeyDown={ onKeyDown }
      >         
        <Form.Item label='Select annotation'>
          <Select
            placeholder='Select annotation'
            value={ annotation ? annotation.name : ''} 
            onChange={ onAnnotationChange }
          >
            { annotationTypes.map(({ name }, i) => (
              <Option key={ i } value={ name }>
                { name }
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Row gutter={ 24 }>
            <Col>
              <Form.Item label='Number of images:'>
                <InputNumber
                  min={ 1 } 
                  max={ 20 }
                  value={ numLoad }
                  onChange={ onNumLoadChange } 
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label='Auto adjust images'>
                <Switch 
                  checked={ autoAdjust }
                  onChange={ onAutoAdjustChange }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        { done ? 
          <Form.Item>
            <Alert 
              type='success'
              message={ <><strong>{ annotation.name }</strong> annotation completed!</> }
            />
          </Form.Item>
          : 
          <>
            { annotation && 
              <>
                <Form.Item>
                  <Alert message={ 
                    <Fragment>
                      <div className='helpMessageDiv'>
                        <div className='helpMessage'>
                          Select <strong>left</strong>, <strong>front</strong>, and <strong>right</strong> images containing: <strong>{ annotation.name }</strong> <br/>
                        </div> 
                        <Button
                          className='iconButton'
                          type='link'
                          href={ helpUrls[annotation.name] }
                          icon={ <QuestionCircleOutlined style={{ fontSize: 'large' }} /> }
                        />
                      </div>
                    </Fragment>
                  } /> 
                  <br />
                  <AnnotationSummary annotationName={ annotation.name }/>
                </Form.Item>
                <Form.Item>
                  <SaveButtonGroup isFirst={ true } />
                </Form.Item>
              </> 
            }
            { loading ?  
                <Spin className='spin' tip='Loading...' /> : 
              annotation ?
                <Form.Item>
                  <Space direction='vertical' size='middle' className='panels'>            
                    { images.map((image, i) => (
                      <AnnotationPanel 
                        key={ i } 
                        image={ image } 
                        autoAdjust={ autoAdjust }
                        flagOptions={ annotation.flags }
                        userFlagOptions={ userFlags }
                        flagShortcuts={ flagShortcuts } />
                    ))}
                  </Space> 
                </Form.Item>
              : null 
            } 
            { annotation && 
              <Form.Item>
                { <SaveButtonGroup /> }
              </Form.Item>
            }
          </>
        }
      </Form> 
      { imageCache.map((id, i) => (
        <Fragment key={ i }>
          <link rel='prefetch' href={ api.getImage(id, 'left') } />
          <link rel='prefetch' href={ api.getImage(id, 'front') } />
          <link rel='prefetch' href={ api.getImage(id, 'right') } />
        </Fragment>
      ))}
    </>
  )
}