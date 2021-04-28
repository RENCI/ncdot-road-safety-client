import React from 'react'
import { Link } from 'react-router-dom'
import { Space } from 'antd'

const BrowseRouteButton = ({ routeID }) => <Link to={ `/routes/${ routeID }/1` }>Browse</Link>

export const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (text, record) => <BrowseRouteButton routeID={ record.id }  />,
  },
]

