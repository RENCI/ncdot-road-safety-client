import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import { Typography } from 'antd'
import { ImageBrowser } from '../components/image-viewer'

const { Title } = Typography

export const BrowseView = () => {
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true)
      await axios.get(`https://picsum.photos/v2/list`)
        .then(response => {
          console.log(response.data)
          setImages(response.data)
          setIsLoading(false)
        })
        .catch(error => {
          console.error(error)
          setIsLoading(false)
        })
    }
    fetchImages()
  }, [])

  return (
    <Fragment>
      <Title level={ 1 }>Browse</Title>
      
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur.
      </p>

      { isLoading && 'Loading images...' }
      { !isLoading && (images.length > 0) && <ImageBrowser images={ images } /> }

    </Fragment>
  )
}
