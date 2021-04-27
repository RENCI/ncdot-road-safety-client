import React from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb } from 'antd'
import { useRouteBrowseContext } from './context'

export const Breadcrumbs = () => {
  const { index, routeID } = useRouteBrowseContext()
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link to="/routes">Routes</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to={ `/routes/${ routeID }` }>{ routeID }</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>{ index + 1 }</Breadcrumb.Item>
    </Breadcrumb>
  )
}

