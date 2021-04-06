import React, { useEffect, useState } from 'react'
import { useAccount } from '../../contexts'

export const AnnotationCounts = () => {
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
    <div className="annotation-summary">
      <h4 className="title">Annotation Summary</h4>
      <div className="body">
        You have saved <strong>{ savedImages.length }</strong> images during this session.<br/>
        You have annotated <strong>{ counts.annotations }</strong> guardrails.<br/>
        You have flagged <strong>{ counts.flags }</strong> images as irrelevant.
      </div>
    </div>
  )
}

