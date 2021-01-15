import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { api } from '../../api'

// needs improvement
export const ImagePrefetch = ({ url }) => <img src={ url } style={{ display: 'none' }} />

ImagePrefetch.propTypes = {
  url: PropTypes.string.isRequired,
}

// pass image basename to prefetch three-images in scene
export const ScenePrefetch = ({ imageBaseName }) => {
  if (!imageBaseName) return null
  return (
    <Fragment>
      <ImagePrefetch url={ api.getImage(imageBaseName, 'left') } />
      <ImagePrefetch url={ api.getImage(imageBaseName, 'front') } />
      <ImagePrefetch url={ api.getImage(imageBaseName, 'right') } />
    </Fragment>
  )
}

ScenePrefetch.propTypes = {
  imageBaseName: PropTypes.string,
}
