import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useAccount } from '../../contexts'
import { Collapse, Spin, Space, Typography } from 'antd'
import './annotation-summary.css'

const { Title } = Typography
const { Panel } = Collapse

export const AnnotationSummary = ({ annotationName }) => {
  const { annotationDetails, refreshAnnotationDetails } = useAccount()

  if (!annotationDetails) {
    return <Spin />
  }

  const currentAnnotations = annotationDetails.current[annotationName]
  const previousAnnotations = annotationDetails.previous[annotationName]

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Collapse>
        <Panel header={ <Fragment>Annotation Summary for <strong>{ annotationName }</strong></Fragment> } key="1">
          <strong>During this Session:</strong>{` `}
            {
              currentAnnotations && (
              <Fragment>
                <span className="annotation-count">{ currentAnnotations.positive + currentAnnotations.negative }</span> images{` `}
                ( <span className="annotation-count positive">{ currentAnnotations.positive }</span> positive,{` `}
                  <span className="annotation-count negative">{ currentAnnotations.negative }</span> negative ) <br />
              </Fragment>
            )
          }
          <strong>Overall:</strong>{` `}
            {
              previousAnnotations && (
                <Fragment>
                  <span className="annotation-count">{ previousAnnotations.positive + previousAnnotations.negative + currentAnnotations.positive + currentAnnotations.negative }</span> images{` `}
                  ( <span className="annotation-count positive">{ previousAnnotations.positive + currentAnnotations.positive }</span> positive,{` `}
                    <span className="annotation-count negative">{ previousAnnotations.negative + currentAnnotations.negative }</span> negative )<br />
                </Fragment>
              )
            }
        </Panel>
      </Collapse>
    </Space>
  )
}

AnnotationSummary.propTypes = {
  annotationName: PropTypes.string.isRequired,
}
