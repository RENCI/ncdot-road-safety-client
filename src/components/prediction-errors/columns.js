import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Tooltip, Tag } from 'antd'
import { CarOutlined as CarIcon } from '@ant-design/icons'

// XXX: Borrowed from columns.js in routes-table. 
// May want to refactor to separate component re-used by both.
const TableActionButton = ({ icon, url, tip }) => {
  const history = useHistory()
  return (
    <Tooltip title={ tip }>
      <Button
        type='default'
        size='small'
        icon={ icon }
        onClick={ () => history.push(url) }
      />
    </Tooltip>
  )
}

const colors = {
  fp: `var(--color-negative)`,
  fn: `var(--color-positive)`
}

export const columns = [  
  {
    title: 'Route',
    dataIndex: 'route',
    sorter: (a, b) => a.route.localeCompare(b.route)
  },
  {
    title: 'Image',
    dataIndex: 'id',
    sorter: (a, b) => a.id.localeCompare(b.id)
  },
  {
    title: 'Type',
    dataIndex: 'type',  
    filters: [
      { text: 'False positive', value: 'fp' },
      { text: 'False negative', value: 'fn' }
    ],
    onFilter: (value, record) => record.type === value,
    filterMultiple: false,
    sorter: (a, b) => a.type.localeCompare(b.type),
    render: (text, record) => (
      <Tag color={ colors[record.type] } >
        { record.type === 'fp' ? 'False positive' : 'False negative' }
      </Tag>
    )
  },
  {
    title: 'Probability',
    dataIndex: 'probability',
    sorter: (a, b) => a.probability - b.probability
  },
  {
    title: 'Actions',
    render: (text, record) => (
      <TableActionButton 
        tip='View Error' 
        icon={ <CarIcon /> } 
        url={ `/routes/${ record.route }/${ record.index}` } 
      />
    )
  },
]

