import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { api } from '../../api'
import './scene.css'

export const Scene = ({ timestamp }) => {
  return (
    <div className="scene">
      <img src={ api.getImage(timestamp, 'right') } width="33%" />
      <img src={ api.getImage(timestamp, 'front') } width="33%" />
      <img src={ api.getImage(timestamp, 'left') } width="33%" />
    </div>
  )
}

Scene.propTypes = {
  timestamp: PropTypes.string.isRequired,
}