import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Typography } from 'antd'
import { api } from '../../api'

const { Paragraph, Title } = Typography

export const ExpansionPanel = ({ data: route }) => {
  const [imageIDs, setImageIDs] = useState([])

  useEffect(() => {
    const fetchRouteImageBaseNames = async () => await api.getRouteInfo(route.id)
      .then(response => {
        if (response?.data?.route_image_base_names) {
          setImageIDs(response.data.route_image_base_names)
        }
      })
      .catch(error => console.error(error))
    fetchRouteImageBaseNames()
  }, [])

  return (
    <pre>
      <Title level={ 3 }>{ route.name }</Title>
      
      <Paragraph copyable>
        { route.id }
      </Paragraph>
      
      <Paragraph>
        { imageIDs.length } images along this route
      </Paragraph>

      <Paragraph>
        <Link to={ `/routes/${ route.id }/1` }>Browse this route</Link>
      </Paragraph>
    </pre>
    
  )
}
