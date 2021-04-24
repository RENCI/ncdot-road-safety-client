import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Typography } from 'antd'
import { api } from '../../api'
import './expansion-panel.css'

const { Paragraph, Title } = Typography

export const ExpansionPanel = ({ data: route }) => {
  const [imageIDs, setImageIDs] = useState([])
  const [startingCoordinates, setStartingCoordinates] = useState({ lat: 0, long: 0 })
  const [endingCoordinates, setEndingCoordinates] = useState({ lat: 0, long: 0 })

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

  useEffect(() => {
    if (!imageIDs) { return }
    const fetchEndpointCoordinates = async () => {
      await api.getImageMetadata(imageIDs[0])
        .then(response => {
          setStartingCoordinates({ lat: response.data.metadata.lat, long: response.data.metadata.long })
        })
      await api.getImageMetadata(imageIDs[imageIDs.length - 1])
        .then(response => {
          setEndingCoordinates({ lat: response.data.metadata.lat, long: response.data.metadata.long })
        })
    }
    fetchEndpointCoordinates()
  }, [imageIDs])

  return (
    <article>
      <Paragraph strong copyable>{ route.id }</Paragraph>
      
      <Paragraph>
        { imageIDs.length } image{ imageIDs.length !== 1 ? 's' : '' } along this route
      </Paragraph>

      <Paragraph>
        Start: { startingCoordinates.lat } latitude, { startingCoordinates.long } longitude<br/>
        End: { endingCoordinates.lat } latitude, { endingCoordinates.long } longitude
      </Paragraph>

      <Paragraph>
        <Link to={ `/routes/${ route.id }/1` }>Browse this route</Link>
      </Paragraph>
    </article>
    
  )
}
