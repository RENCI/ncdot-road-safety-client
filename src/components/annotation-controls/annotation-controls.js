import React, { useState, useContext, useReducer, useEffect } from 'react'
import { Space, Select, Tag, Button, notification } from 'antd'
import axios from 'axios'
import { AnnotationsContext, ImageContext } from '../../contexts'
import { api } from '../../api'
import './annotation-controls.css'

const Option = Select.Option

export const AnnotationControls = () => {
  const [saving, setSaving] = useState(false)
  const [saveEnabled, setSaveEnabled] = useState(true)
  const [allAnnotations] = useContext(AnnotationsContext)
  const [image] = useContext(ImageContext)

  const [annotations, annotationsDispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "set": {
        return [...action.annotations]
      }

      case "add": { 
        return state.find(({ id }) => id === action.annotation.id) ? 
          [...state] : [...state, action.annotation]
      }

      case "remove": {
        const index = state.findIndex(({ id }) => id === action.annotation.id)

        if (index === -1) return [...state]

        const newState = [...state]

        newState.splice(index, 1)

        return newState
      }
  
      default: 
        throw new Error("Invalid action: " + action.type)
    }
  }, [])

  useEffect(() => {
    const annotations = image.annotations.map(({ annotation_name }) => {
      return {
        id: annotation_name,
        label: annotation_name
      }
    })

    annotationsDispatch({ type: 'set', annotations: annotations })
  }, [image])

  const handleSelectChange = value => {    
    const annotation = allAnnotations.find(({ id }) => id === value)

    if (annotation) {
      annotationsDispatch({ type: "add", annotation: annotation })
      setSaveEnabled(true)
    }
  }

  const handleTagClose = annotation => {
    annotationsDispatch({ type: "remove", annotation: annotation })
    setSaveEnabled(true)
  }

  const handleSaveClick = async () => {    
    try {     
      setSaving(true);

      axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
      axios.defaults.xsrfCookieName = 'csrftoken'

      // XXX: Not handling "false" annotations   
      await axios.post(api.saveAnnotations, {
        annotations: annotations.map(({ id }) => {
          return {
            image_base_name: image.id,
            annotation_name: id,
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
      <Space direction="vertical">
          <Select
            showSearch
            placeholder="Add an annotation"
            optionFilterProp="children"
            value={null}
            filterOption={ (input, option) => option.props.children.toLowerCase().includes(input.toLowerCase()) }
            onChange={ handleSelectChange }
          >
            { allAnnotations.filter(annotation => (
                !annotations.find(({ id }) => annotation.id === id)
              )).map((annotation, i) => (
                <Option key={ i } value={ annotation.id }>
                  { annotation.label }
                </Option>
              )) 
            }
          </Select>

          <div>
          { annotations.map((annotation, i) => (
              <Tag 
                key={ i } 
                closable 
                onClose={ e => { 
                  e.preventDefault() 
                  handleTagClose(annotation) 
                }}
              >
                { annotation.label }
              </Tag>
            )) 
          }
          </div>

        <Button 
          loading={ saving }
          disabled={ !saveEnabled }
          onClick={ handleSaveClick }
        >
          Save
        </Button>
     </Space>
    </>
  )
}