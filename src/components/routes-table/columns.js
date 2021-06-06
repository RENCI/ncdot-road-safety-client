import React from 'react'
import { Link } from 'react-router-dom'
import { Space } from 'antd'

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
    render: (text, record) => (
      <Fragment>
        <Link to={ `/routes/${ record.id }` }>Summary</Link>
        <Link to={ `/routes/${ record.id }/1` }>Browse</Link>
      </Fragment>
    ),
  },
]

