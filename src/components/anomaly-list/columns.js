import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

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
        <Link to={ `/routes/${ record.id }/1` }>View</Link>
      </Fragment>
    ),
  },
]

