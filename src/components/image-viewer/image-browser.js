import React, { useState, useContext } from 'react'
import { Button } from 'antd'
import { LeftOutlined as PreviousIcon, RightOutlined as NextIcon } from '@ant-design/icons'
import './image-browser.css'
import { Scene } from '../scene'
import { ImageContext } from '../../contexts'

const someTimeStamps = [
  '10000174727',
  '10000174808',
  '10000174819',
  '10000174829',
  '10000174909',
  '10000174920',
  '10000174920',
  '10000175011',
  '10000175022',
  '10000175103'
]

export const ImageBrowser = () => {
  const [image, imageDispatch] = useContext(ImageContext)
  const [index, setIndex] = useState(0)

  const handleClickPrevious = () => {
    setIndex(index => Math.max(0, index - 1))

    // XXX: Get previous image based on mode
    // XXX: Does this make sense for annotation-based? Might want ability to go back, but might
    // need to save that in the client
  }

  const handleClickNext = () => {
    setIndex(index => Math.min(index + 1, someTimeStamps.length - 1))

    // XXX: Get next image based on mode
  }

  return (
    <div className="image-viewer">
      <div className="image-actions">
        <Button type="primary" onClick={ handleClickPrevious } disabled={ index === 0 }><PreviousIcon /></Button>
        <Button type="primary" onClick={ handleClickNext } disabled={ index === someTimeStamps.length - 1 }><NextIcon /></Button>
      </div>

      <br />

      <Scene id={ someTimeStamps[index] } />
    </div>
  )
}