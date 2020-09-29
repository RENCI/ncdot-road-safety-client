import React, { useEffect, useState } from 'react'
import { Button } from 'antd'
import { LeftOutlined as PreviousIcon, RightOutlined as NextIcon } from '@ant-design/icons';
import './image-browser.css'

export const ImageBrowser = ({ images }) => {
  const [index, setIndex] = useState(0)

  const handleClickPrevious = () => {
    setIndex(index => Math.max(0, index - 1))
  }

  const handleClickNext = () => {
    setIndex(index => Math.min(index + 1, images.length - 1))
  }

  return (
    <div className="image-viewer">
      
      <div className="image-actions">
        <Button type="primary" onClick={ handleClickPrevious } disabled={ index === 0 }><PreviousIcon /></Button>
        <Button type="primary" onClick={ handleClickNext } disabled={ index === images.length - 1 }><NextIcon /></Button>
      </div>

      <br />

      <h3>Image { index + 1 } of { images.length }</h3>
      <div className="image-container">
        <img src={ images[index].download_url } width="100%" height="auto" alt="" />
      </div>

    </div>
  )
}