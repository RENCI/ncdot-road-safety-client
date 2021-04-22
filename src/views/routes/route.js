import React, { Fragment, useEffect } from 'react'
import { Typography } from 'antd'
import { useParams } from 'react-router-dom'

const { Title } = Typography

export const BrowseRouteView = (props) => {
  // grab parameters passed in from the route /routes/:routeID/:imageIndex
  // note that imageIndex is shifted by one for human readability
  const { routeID, imageIndex = 1 } = useParams()

  console.log({ routeID, imageIndex })

  // when image (index) changes,
  // update the document title with route & image info
  useEffect(() => { document.title = `Route ${ routeID }, #${ imageIndex } | RHF` }, [routeID, imageIndex])

  return (
    <Fragment>
      <Title level={ 1 }>Route { routeID }</Title>

    </Fragment>
  )
}
