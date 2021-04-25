import React, { useEffect, useState } from 'react'
import { loadModules } from 'esri-loader'

// custom component for map location marker
export const Marker = ({ view, lat, long, color = '#1890ff', size = 8 }) => {
  const [graphic, setGraphic] = useState(null)

  const mapPoint = ({ long, lat }) => {
    const point = { type: 'point', longitude: long, latitude: lat }
    const markerSymbol = { type: 'simple-marker', size: size, color: color }
    return ({
      geometry: point,
      symbol: markerSymbol,
    })
  }

  useEffect(() => {
    // view.graphics.remove(graphic)
    view.graphics.removeAll()
  }, [lat, long, color, size])

  useEffect(() => {
    loadModules(['esri/Graphic']).then(([Graphic]) => {
      let currentLocationPoint = new Graphic(mapPoint({ long, lat }))
      view.graphics.add(currentLocationPoint)
      setGraphic(graphic)
      view.center = [long, lat]
    }).catch(error => console.error(error))

    return function cleanup() {
      view.graphics.remove(graphic)
    }
  }, [lat, long, color, size])

  return null
}

