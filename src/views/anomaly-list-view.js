import React, { useState, useContext, useEffect, useMemo } from 'react'
import { Typography, Form, Select, Space, Statistic, AutoComplete, Divider } from 'antd'
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
  const [routeFilter, setRouteFilter] = useState()

  const routeOptions = useMemo(() => {
    return anomalies ? Array.from(anomalies.reduce((routes, anomaly) => {
      return routes.add(anomaly.route)
    }, new Set())).map(route => ({ label: route, value: route }))
    : null
  }, [anomalies])

  const filteredAnomalies = useMemo(() => {
    return anomalies && routeFilter && routeFilter.length > 0 ? 
      anomalies.filter(({ route }) => route.includes(routeFilter))
      : anomalies ? [...anomalies]
      : null
  }, [anomalies, routeFilter])

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

  const onRouteFilterChange = value => {
    setRouteFilter(value)
  }

  return (
    <>
      <Title level={ 1 }>Prediction Errors</Title>

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
                title='Total errors'
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

            <Divider />

            <Form>
              <Form.Item label='Filter routes'>
                <AutoComplete
                  options={ routeOptions }
                  onChange={ onRouteFilterChange }
                  allowClear={ true }
                  filterOption={ (inputValue, option) => option.value.includes(inputValue) }
                />
              </Form.Item>
            </Form>

          <AnomalyList anomalies={ filteredAnomalies } />
        </>
        : <p>Fetching anomalies...</p>
      }
    </>
  )
}
