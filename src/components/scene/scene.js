import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import { blue } from '@ant-design/colors'
import { Image } from '../image'
import { api } from '../../api'
import './scene.css'

export const Scene = ({ 
  id, aspectRatio, downsample, present, autoAdjust,
  onClick, onKeyPress 
}) => {
  const [active, setActive] = useState(false)

  const hasAnnotation = present ? Object.values(present).reduce((p, c) => {
    return p === 'irrelevant' || c === 'irrelevant' ? 'irrelevant'
      : p === 'present' || c === 'present' ? 'present'
      : 'absent'
   }, 'absent') : 'absent' 

  const [loadedCount, setLoadedCount] = useState(0)
  
  useEffect(() => {
    setLoadedCount(0)
  }, [id])

  const loading = loadedCount < 3

  const onLoad = () => {
    setLoadedCount(loadedCount + 1)
  }

  const onMouseOver = () => {
    if (!active) {
      setActive(true)
    }
  }

  const onMouseLeave = () => {
    if (active) setActive(false)
  }

  const outlineWidth =
    (hasAnnotation === 'present' || hasAnnotation === 'irrelevant') && active ? '6px' :
    hasAnnotation === 'present' || hasAnnotation === 'irrelevant' ? '4px' :
    active ? '2px' :
    '1px'

  const outlineColor = 
    hasAnnotation === 'present' ? '#52c41a' : // XXX: Magic number matching value in image.css
    hasAnnotation === 'irrelevant' ? '#ebc815' : // XXX: Magic number matching value in image.css
    blue.primary

  if (!id) {
    return '...'
  }

  return (
    <div 
      className='scene' 
      style={{ outline: loading ? null : outlineWidth + ' solid ' + outlineColor }}
      onMouseOver={ onMouseOver }
      onMouseLeave={ onMouseLeave }      
    >
      { loading && <Spin className='spinner'/> }
      <Image 
        url={ api.getImage(id, 'left', downsample) } 
        aspectRatio={ aspectRatio }
        loading={ loading }
        present={ present ? present.left : null }
        autoAdjust={ autoAdjust }        
        downsample={ downsample }
        onLoad={ onLoad }
        onClick={ onClick ? () => onClick(id, 'left') : null } 
        onKeyPress={ onKeyPress }
      />
      <Image 
        url={ api.getImage(id, 'front', downsample) } 
        aspectRatio={ aspectRatio }
        loading={ loading }
        present={ present ? present.front : null }
        autoAdjust={ autoAdjust }       
        downsample={ downsample }
        onLoad={ onLoad } 
        onClick={ onClick ? () => onClick(id, 'front') : null } 
        onKeyPress={ onKeyPress }
      />
      <Image 
        url={ api.getImage(id, 'right', downsample) } 
        aspectRatio={ aspectRatio }
        loading={ loading }
        present={ present ? present.right : null }
        autoAdjust={ autoAdjust }       
        downsample={ downsample }
        onLoad={ onLoad }
        onClick={ onClick ? () => onClick(id, 'right') : null }
        onKeyPress={ onKeyPress }
      />        
    </div>
  )
}

Scene.defaultProps = {
  downsample: false,
  autoAdjust: true
}

Scene.propTypes = {
  id: PropTypes.string.isRequired,
  aspectRatio: PropTypes.number,
  downsample: PropTypes.bool,
  autoAdjust: PropTypes.bool,
  present: PropTypes.object,
  onClick: PropTypes.func
}