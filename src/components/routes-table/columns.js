import React, { Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Space, Tooltip } from 'antd'
import {
  CarOutlined as CarIcon,
  AreaChartOutlined as SummaryIcon,
} from '@ant-design/icons'

/* This component is only so history.push can be used. */
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
      <Space direction="horizontal" size={ 16 }>
        <TableActionButton tip="View Route Summary" icon={ <SummaryIcon /> } url={ `/routes/${ record.id }` } />
        <TableActionButton tip="Drive this Route" icon={ <CarIcon /> } url={ `/routes/${ record.id }/1` } />
      </Space>
    ),
  },
]

