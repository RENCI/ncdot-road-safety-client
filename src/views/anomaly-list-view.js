import React, { useState, useContext, useEffect } from 'react'
import { Typography, Form, Select, Space, Statistic } from 'antd'
import { AnnotationsContext } from '../contexts'
import { AnomalyList } from '../components/anomaly-list'
import { api } from '../api'

const { Title } = Typography
const { Option } = Select

export const AnomalyListView = () => {
  const [annotationTypes] = useContext(AnnotationsContext)
  const [annotationOptions, setAnnotationOptions] = useState([])
  const [annotation, setAnnotation] = useState('')
  const [anomalies, setAnomalies] = useState()

  const getAnomalies = async annotation => {
    setAnomalies()

    const getAnomaly = (anomaly, type) => {
      return {
        route: anomaly.route_id,
        index: anomaly.route_index,
        id: anomaly.image_base_name,
        type: type,
        probability: +anomaly.certainty
      }
    }

    try {
      const fps = await api.getFalsePositives(annotation)
      const fns = await api.getFalseNegatives(annotation)

      const anomalies = fps.data.fps_info.map(fp => getAnomaly(fp, 'fp'))
        .concat(fns.data.fns_info.map(fn => getAnomaly(fn, 'fn')))

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

  return (
    <>
      <Title level={ 1 }>Prediction Anomalies</Title>

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
      </Form>

      { anomalies ? 
        <>
          <Space direction='horizontal' size='large'>
            <Statistic
              title='Total anomalies'
              value={ anomalies.length }
            />
            <Statistic
              title='False positives'
              value={ anomalies.filter(({ type }) => type === 'fp').length }
              valueStyle={{ color: 'var(--color-negative)' }}
            />
            <Statistic
              title='False negatives'
              value={ anomalies.filter(({ type }) => type === 'fn').length }
              valueStyle={{ color: 'var(--color-positive)' }}
            />
          </Space>

          <AnomalyList anomalies={ anomalies } />
        </> 
        : <p>Fetching anomalies...</p>
      }
    </>
  )
}
