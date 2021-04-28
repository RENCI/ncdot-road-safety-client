import React, { Fragment } from 'react'
import { useRouteBrowseContext } from './context'
import { api } from '../../api'

export const ScenePrefetch = ({ id }) => {
  return (
    <Fragment>
      <link rel='prefetch' href={ api.getImage(id, 'left') } />
      <link rel='prefetch' href={ api.getImage(id, 'front') } />
      <link rel='prefetch' href={ api.getImage(id, 'right') } />
    </Fragment>
  )
}
