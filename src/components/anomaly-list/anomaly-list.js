import React, { useState, useContext, useEffect } from 'react'
import { Form, Select } from 'antd'
import { Table } from 'antd'
import { AnnotationsContext } from '../../contexts'
import { columns } from './columns'
import { api } from '../../api'

const { Option } = Select;

export const AnomalyList = () => {
  const [annotationTypes] = useContext(AnnotationsContext)
  const [annotationOptions, setAnnotationOptions] = useState([])
  const [annotation, setAnnotation] = useState('')
  const [anomalies, setAnomalies] = useState([])

  const getAnomalies = async annotation => {
    try {
      const fps = await api.getFalsePositives(annotation)
      const fns = await api.getFalseNegatives(annotation)

      const anomalies = fps.data.fps_info.map(fp => {
        return {
          id: fp.image_base_name,
          type: 'fp',
          probability: fp.certainty
        }
      }).concat(fns.data.fns_info.map(fn => {
        return {
          id: fn.image_base_name,
          type: 'fn',
          probability: fn.certainty
        }
      }))

      setAnomalies(anomalies)
    }
    catch (error) {
      console.log(error)
    }
  }

  const onAnnotationChange = value => {
    setAnnotation(value)
    getAnomalies(value)
  }

  useEffect(() => {
    if (annotationTypes.length > 0) {
      const options = annotationTypes.map(({ name }) => name)

      setAnnotationOptions(options)
      setAnnotation(options[0])
      getAnomalies(options[0])
    } 
  }, [annotationTypes])

  console.log(anomalies)

  return (
    <Form>
      <Form.Item label='Select annotation'>
        <Select
          placeholder='Select annotation'
          value={ annotation } 
          onChange={ onAnnotationChange }
        >
          { annotationOptions.map((annotation, i) => (
            <Option key={ i } value={ annotation }>
              { annotation }
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Table
        pagination={{
          position: ['topRight', 'bottomRight'],
        }}
        dataSource={ anomalies.map(({ id, type, probability }) => ({
          key: id,
          id: id,
          type: type,
          typeName: type === 'fp' ? 'False positive' : 'False negative',
          probability: probability
        })) }
        showSizeChanger={ false }
        columns={ columns }
        defaultSortField='id'
      />
    </Form>
  )
}