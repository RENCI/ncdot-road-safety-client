import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { columns } from './columns'

export const PredictionErrors = ({ errors }) => {
  return (
    <Table
      pagination={{
        position: ['bottomRight'],
      }}
      dataSource={ errors.map(error => ({
        ...error,
        key: error.id
      })) }
      showSizeChanger={ false }
      columns={ columns }
      defaultSortField='id'
    />
  )
}

PredictionErrors.propTypes = {
  errors: PropTypes.array.isRequired
}

PredictionErrors.defaultProps = {
  errors: []
}