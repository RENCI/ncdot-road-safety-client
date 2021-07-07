import React, { useState, useContext, useEffect, useMemo } from 'react'
import { Typography, Form, Select, Space, Statistic, AutoComplete, Divider } from 'antd'
import { AnnotationsContext } from '../contexts'
import { PredictionErrors } from '../components/prediction-errors'
import { api } from '../api'

const { Title } = Typography
const { Option } = Select

export const PredictionErrorView = () => {
  const [annotationTypes] = useContext(AnnotationsContext)
  const [annotationOptions, setAnnotationOptions] = useState([])
  const [annotation, setAnnotation] = useState('')
  const [errors, setErrors] = useState()
  const [routeFilter, setRouteFilter] = useState()

  const routeOptions = useMemo(() => {
    return errors ? Array.from(errors.reduce((routes, error) => {
      return routes.add(error.route)
    }, new Set())).map(route => ({ label: route, value: route }))
    : null
  }, [errors])

  const filterederrors = useMemo(() => {
    return errors && routeFilter && routeFilter.length > 0 ? 
      errors.filter(({ route }) => route.includes(routeFilter))
      : errors ? [...errors]
      : null
  }, [errors, routeFilter])

  const getErrors = async annotation => {
    setErrors()

    const getError = (error, type) => {
      return {
        route: error.route_id,
        index: error.route_index,
        id: error.image_base_name,
        type: type,
        probability: +error.certainty
      }
    }

    try {
      const fps = await api.getFalsePositives(annotation)
      const fns = await api.getFalseNegatives(annotation)

      const errors = fps.data.fps_info.map(fp => getError(fp, 'fp'))
        .concat(fns.data.fns_info.map(fn => getError(fn, 'fn')))

      setErrors(errors)
    }
    catch (error) {
      console.log(error)
    }
  }

  const onAnnotationChange = value => {
    setAnnotation(value)
    getErrors(value)
  }

  useEffect(() => {
    if (annotationTypes.length > 0) {
      const options = annotationTypes.map(({ name }) => name)

      setAnnotationOptions(options)
      setAnnotation(options[0])
      getErrors(options[0])
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

      { errors ? 
        <>
            <Space direction='horizontal' size='large'>
              <Statistic
                title='Total errors'
                value={ errors.length }
              />
              <Statistic
                title='False positives'
                value={ errors.filter(({ type }) => type === 'fp').length }
                valueStyle={{ color: 'var(--color-negative)' }}
              />
              <Statistic
                title='False negatives'
                value={ errors.filter(({ type }) => type === 'fn').length }
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

          <PredictionErrors errors={ filterederrors } />
        </>
        : <p>Fetching errors...</p>
      }
    </>
  )
}
