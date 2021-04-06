import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useAccount } from '../../contexts'
import { Collapse, Space } from 'antd'

const { Panel } = Collapse

export const AnnotationSummary = ({ annotationName }) => {
  const { savedImages } = useAccount()
  const [counts, setCounts] = useState({
    images: 0,
    annotations: 0,
    flags: 0,
  })

  useEffect(() => {
    const images = savedImages.length
    const annotations = savedImages.reduce((total, image) => {
      const hasAnnotation = [image.present.left, image.present.front, image.present.right].includes('present') ? 1 : 0
      return total + hasAnnotation
    }, 0)
    const flags = savedImages.reduce((total, image) => {
      const hasFlag = [image.present.left, image.present.front, image.present.right].includes('irrelevant') ? 1 : 0
      return total + hasFlag
    }, 0)
    setCounts({
      ...counts,
      images: savedImages.length,
      annotations: annotations,
      flags: flags,
    })
  }, [savedImages])

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Collapse collapsible="header">
        <Panel header="Annotation Summary" key="1">
          You have saved <strong>{ savedImages.length }</strong> images during this session.<br/>
          You have annotated <strong>{ counts.annotations }</strong> { annotationName }.<br/>
          You have flagged <strong>{ counts.flags }</strong> images as irrelevant.
        </Panel>
      </Collapse>
    </Space>
  )
}

AnnotationSummary.propTypes = {
  annotationName: PropTypes.string.isRerquired,
}
