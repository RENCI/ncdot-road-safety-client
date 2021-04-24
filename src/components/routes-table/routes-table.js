import React from 'react'
import { Link } from 'react-router-dom'
import { Space, Table } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import { ExpansionPanel } from './expansion-panel'
import { useRoutes } from '../../contexts'

const columns = [
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
    render: (text, record) => <Space size="middle" align="center"><Link to={ `/routes/${ record.id }/1` }>Browse <ArrowRightOutlined /></Link></Space>,
  },
]

export const RoutesTable = () => {
  const { routes } = useRoutes()

  if (!routes.length) {
    return <p>Fetching routes...</p>
  }

  return (
    <Table
      pagination={{
        position: 'bottomCenter',
        pageSize: 20,
      }}
      dataSource={ routes.map(id => ({
        key: id,
        id: id,
        name: `Route ${ id }`,
      })) }
      showSizeChanger={ false }
      columns={ columns }
      defaultSortField="id"
      expandable={{
        rowExpandable: record => true,
        expandedRowRender: record => <ExpansionPanel data={ record } />,
        expandedRowClassName: () => 'expansion-panel',
      }}
    />
  )
}
