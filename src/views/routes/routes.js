import React, { Fragment } from 'react'
import { Typography } from 'antd'
import { useRoutes } from '../../contexts'
import { RoutesTable } from '../../components/routes-table'

const { Title } = Typography

export const BrowseRoutesView = () => {
  const { routes } = useRoutes()

  if (!routes.length) {
    return <p>Fetching routes...</p>
  }

   return (
    <Fragment>
      
      <Title level={ 1 }>Routes</Title>

      <RoutesTable routes={ routes } />

    </Fragment>
  )
}
