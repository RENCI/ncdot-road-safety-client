import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { columns } from './columns'

export const AnomalyList = ({ anomalies }) => {

  console.log(anomalies)
  return (
    <Table
      pagination={{
        position: ['topRight', 'bottomRight'],
      }}
      dataSource={ anomalies.map(anomaly => ({
        ...anomaly,
        key: anomaly.id,
        typeName: anomaly.type === 'fp' ? 'False positive' : 'False negative'
      })) }
      showSizeChanger={ false }
      columns={ columns }
      defaultSortField='id'
    />
  )
}

AnomalyList.propTypes = {
  anomalies: PropTypes.array.isRequired
}

AnomalyList.defaultProps = {
  anomalies: []
}