import React, { Fragment } from 'react'
import { api } from '../../api'

export const ScenePrefetch = ({ id }) => {
  return (
    <Fragment>
      <img src={ api.getImage(id, 'left') } hidden />
      <img src={ api.getImage(id, 'front') } hidden />
      <img src={ api.getImage(id, 'right') } hidden />
    </Fragment>
  )
}
