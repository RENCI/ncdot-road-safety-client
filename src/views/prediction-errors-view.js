import React, { useEffect, useState, useMemo } from 'react'
import { 
  Typography, Form, Select, Space, Statistic, AutoComplete, 
  Divider, Spin, Row, Col, Button, Tooltip
} from 'antd'
import { RedoOutlined } from '@ant-design/icons'
import { useAnnotations, usePredictionErrors } from '../contexts'
import { PredictionErrors } from '../components/prediction-errors'
import { api } from '../api'

const { Title } = Typography
const { Option } = Select

export const PredictionErrorsView = () => {
  const [{ annotation, allErrors, errors, filteredErrors, routeFilter, routes }, errorDispatch] = usePredictionErrors()
  const [annotationTypes] = useAnnotations()
  const [loading, setLoading] = useState(false)

  const annotationOptions = annotationTypes.map(({ name }) => name)
  const routeOptions = useMemo(() => routes.map(route => ({ label: route, value: route })), [routes])

  const getErrors = async annotation => {
    setLoading(true)

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

      setLoading(false)

      return errors;
    }
    catch (error) {
      console.log(error)
    }
  }

  const setAnnotation = async annotation => {
    if (allErrors[annotation]) {
      errorDispatch({ type: 'setAnnotation', annotation: annotation })
    }
    else {
      const errors = await getErrors(annotation);

      errorDispatch({ type: 'setAnnotationErrors', annotation: annotation, errors: errors })
      errorDispatch({ type: 'setAnnotation', annotation: annotation })
    }
  }

  useEffect(() => { 
    if (!annotation && annotationTypes.length > 0) {
      setAnnotation(annotationTypes[0].name)
    }
  }, [annotationTypes])

  const onAnnotationChange = value => {
    setAnnotation(value)
  }

  const onReloadClick = async () => {
    const errors = await getErrors(annotation);

    errorDispatch({ type: 'setAnnotationErrors', annotation: annotation, errors: errors })
    errorDispatch({ type: 'setAnnotation', annotation: annotation })
  }

  const onRouteFilterChange = value => {
    errorDispatch({ type: 'setRouteFilter', routeFilter: value })
  }

  return (
    <>
      <Title level={ 1 }>Prediction Errors</Title>

      <Form>
        <Row gutter={[8, 0]}>
          <Col flex='auto'>
            <Form.Item label='Select annotation'  style={{ margin: 0, padding: 0 }}>
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
          </Col>
          <Col>
            <Form.Item>       
              <Tooltip title="Reload prediction errors">      
                <Button 
                  icon={<RedoOutlined /> } 
                  onClick={ onReloadClick }
                />
              </Tooltip> 
            </Form.Item>
          </Col>
        </Row>
      </Form>

      { loading ?
        <Space direction='horizontal'>
          <Spin /> 
          <>Loading prediction errors...</>
        </Space>        
      : errors && 
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
      }
    </>
  )
}
