import React, { useEffect, useState, useContext } from 'react'
import { Button, Typography } from 'antd'
import { LeftOutlined as PreviousIcon, RightOutlined as NextIcon } from '@ant-design/icons'
import axios from 'axios'
import { Scene } from '../scene'
import { ImageContext } from '../../contexts'
import { api } from '../../api'
import './image-browser.css'

const { Text } = Typography

const someTimeStamps = [
  '10000174727',
  '10000174808',
  '10000174819',
  '10000174829',
  '10000174909',
  '10000174920',
  '10000175011',
  '10000175022',
  '10000175103'
]

export const ImageBrowser = () => {
  const [index, setIndex] = useState(0)
  const [image, imageDispatch] = useContext(ImageContext)

  const getImage = async index => {
    const id = someTimeStamps[index];

    try {    
      const annotationsResult = await axios.get(api.getImageAnnotations(id))
      const metadataResult = await axios.get(api.getImageMetadata(id))

      imageDispatch({ 
        type: 'setImage', 
        id: id,
        annotations: annotationsResult.data.annotations,
        metadata: metadataResult.data.metadata 
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!image || image.id === null) getImage(index)
  }, [])

  const handleClickPrevious = () => {
    const newIndex = Math.max(0, index - 1)

    setIndex(newIndex)
    getImage(newIndex)
  }

  const handleClickNext = () => {
    const newIndex = Math.min(index + 1, someTimeStamps.length - 1)

    setIndex(newIndex)
    getImage(newIndex)
  }

  return (
    <div className='image-viewer'>
      <div className='image-actions'>
        <Button type='primary' onClick={ handleClickPrevious } disabled={ index === 0 }><PreviousIcon /></Button>
        <Button type='primary' onClick={ handleClickNext } disabled={ index === someTimeStamps.length - 1 }><NextIcon /></Button>
      </div>

      <br />

      { image.id ? <Scene id={ image.id } /> : null }

      <div style={{ marginTop: 10 }}>
        <div><Text type='secondary'>Latitude: { image.metadata ? image.metadata.lat : null }</Text></div>
        <div><Text type='secondary'>Longitude: { image.metadata ? image.metadata.long : null }</Text></div>
      </div>
    </div>
  )
}