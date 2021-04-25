import React from 'react'
import { Table } from 'antd'
import { useRoutes } from '../../contexts'
import { ExpansionPanel } from './expansion-panel'
import { columns } from './columns'

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
