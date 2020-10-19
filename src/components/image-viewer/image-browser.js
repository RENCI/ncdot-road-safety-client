import React, { useEffect, useState, useContext } from 'react'
import { Button, Typography } from 'antd'
import { LeftOutlined as PreviousIcon, RightOutlined as NextIcon } from '@ant-design/icons'
import './image-browser.css'
import { Scene } from '../scene'
import { ImageContext } from '../../contexts'
import { api } from '../../api'
import axios from 'axios'

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

  useEffect(() => {
    (async () => {
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
    })()
  }, [index])

  const handleClickPrevious = () => {
    // XXX: Get previous image based on mode
    // XXX: Does this make sense for annotation-based? Might want ability to go back, but might
    // need to save that in the client
    setIndex(index => Math.max(0, index - 1))
  }

  const handleClickNext = () => {
    // XXX: Get next image based on mode
    setIndex(index => Math.min(index + 1, someTimeStamps.length - 1))
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