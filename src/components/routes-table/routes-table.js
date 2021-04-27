import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { ExpansionPanel } from './expansion-panel'
import { columns } from './columns'

export const RoutesTable = ({ routes }) => {
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

RoutesTable.propTypes = {
  routes: PropTypes.array.isRequired,
}

RoutesTable.defaultProps = {
  routes: [],
}
