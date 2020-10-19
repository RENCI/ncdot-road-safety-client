import React from 'react'
import PropTypes from 'prop-types'
import { api } from '../../api'
import './scene.css'

export const Scene = ({ id }) => {
  return (
    <div className="scene">
      <img src={ api.getImage(id, 'right') } width="33%" />
      <img src={ api.getImage(id, 'front') } width="33%" />
      <img src={ api.getImage(id, 'left') } width="33%" />
    </div>
  )
}

Scene.propTypes = {
  id: PropTypes.string.isRequired,
}