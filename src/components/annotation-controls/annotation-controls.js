import React, { useState, useContext, useReducer, useEffect } from 'react'
import { Space, Select, Tag, Button } from 'antd'
import axios from 'axios'
import { AnnotationsContext, ImageContext } from '../../contexts'
import { api } from '../../api'
import './annotation-controls.css'

const Option = Select.Option

export const AnnotationControls = () => {
  const [saving, setSaving] = useState(false)
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
    annotationsDispatch({ type: 'set', annotations: image.annotations })
  }, [image])

  const handleSelectChange = value => {
    const annotation = allAnnotations.find(({ id }) => id === value)

    if (annotation) annotationsDispatch({ type: "add", annotation: annotation })
  }

  const handleTagClose = annotation => {
    annotationsDispatch({ type: "remove", annotation: annotation })
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
          onClick={ handleSaveClick }
        >
          Save
        </Button>
     </Space>
    </>
  )
}