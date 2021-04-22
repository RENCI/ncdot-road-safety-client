import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Space, Table, Typography } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import { useRoutes } from '../../contexts'

const { Title } = Typography

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

export const BrowseRoutesView = () => {
  const { routes } = useRoutes()

  if (!routes.length) {
    return <p>Fetching routes...</p>
  }
  return (
    <Fragment>
      <Title level={ 1 }>Routes</Title>
      <Table
        pagination={{
          position: 'bottomCenter',
          pageSize: 20,
        }}
        dataSource={ routes.map(id => ({
          id: id,
          name: `Route ${ id }`,
        })) }
        columns={ columns }
      />
    </Fragment>
  )
}
