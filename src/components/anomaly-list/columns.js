import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

export const columns = [
  {
    title: 'Image',
    dataIndex: 'id',
    key: 'image',
  },
  {
    title: 'Type',
    dataIndex: 'typeName',
    key: 'type',
  },
  {
    title: 'Probability',
    dataIndex: 'probability',
    key: 'probability',
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

