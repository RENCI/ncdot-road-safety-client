import React, { useEffect, useMemo } from 'react'
import { Typography, Form, Select, Space, Statistic, AutoComplete, Divider } from 'antd'
import { useAnnotations, usePredictionErrors } from '../contexts'
import { PredictionErrors } from '../components/prediction-errors'
import { api } from '../api'

const { Title } = Typography
const { Option } = Select

export const PredictionErrorsView = () => {
  const [{ annotation, errors, filteredErrors, routeFilter, routes }, errorDispatch] = usePredictionErrors()
  const [annotationTypes] = useAnnotations()

  console.log(annotation, errors, filteredErrors, routeFilter, routes);

  const annotationOptions = annotationTypes.map(({ name }) => name)
  const routeOptions = useMemo(() => routes.map(route => ({ label: route, value: route })), [routes])

  const getErrors = async annotation => {
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

      return errors
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {    
    const initErrors = async () => {
      if (annotationTypes.length > 0) {
        const annotation = annotationTypes[0].name
        const errors = await getErrors(annotation)

        errorDispatch({ type: 'setErrors', annotation: annotation, errors: errors })
      }
    }

    initErrors()
  }, [annotationTypes])

  const onAnnotationChange = async value => {
    const errors = await getErrors(value)

    console.log(errors);

    errorDispatch({ type: 'setErrors', annotation: value, errors: errors })
  }

  const onRouteFilterChange = value => {
    errorDispatch({ type: 'setRouteFilter', routeFilter: value })
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
                value={ routeFilter }
              />
            </Form.Item>
          </Form>

          <PredictionErrors errors={ filteredErrors } />
        </>
        : <p>Fetching errors...</p>
      }
    </>
  )
}
