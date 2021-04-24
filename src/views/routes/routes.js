import React, { Fragment } from 'react'
import { Typography } from 'antd'
import { RoutesTable } from '../../components/routes-table'

const { Title } = Typography

export const BrowseRoutesView = () => {
  return (
    <Fragment>
      
      <Title level={ 1 }>Routes</Title>

      <RoutesTable />

    </Fragment>
  )
}
