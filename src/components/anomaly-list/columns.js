import React, { Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Space, Tooltip } from 'antd'
import { CarOutlined as CarIcon } from '@ant-design/icons'

// XXX: Borrowed from columns.js in routes-table. 
// May want to refactor to separate component re-used by both.
const TableActionButton = ({ icon, url, tip }) => {
  const history = useHistory()
  return (
    <Tooltip title={ tip }>
      <Button
        type="default"
        size="small"
        icon={ icon }
        onClick={ () => history.push(url) }
      />
    </Tooltip>
  )
}

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
      <TableActionButton 
        tip="Drive this Route" 
        icon={ <CarIcon /> } 
        url={ `/routes/${ record.route }/1` } 
      />
    ),
  },
]

