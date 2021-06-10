import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { loadModules } from 'esri-loader'

// custom component for map location marker
export const Marker = ({ view, lat, long, fill, stroke, size, style }) => {
  const [graphic, setGraphic] = useState(null)

  const mapMarker = ({ long, lat }) => {
    const point = { type: 'point', longitude: long, latitude: lat }
    const markerSymbol = {
      type: 'simple-marker',
      size: size,
      color: fill,
      style: style,
      outline: {
        color: stroke,
        width: '1px',
      }
    }
    return ({
      geometry: point,
      symbol: markerSymbol,
    })
  }

  useEffect(() => {
    view.graphics.removeAll()
  }, [lat, long])

  useEffect(() => {
    loadModules(['esri/Graphic']).then(([Graphic]) => {
      let currentLocationPoint = new Graphic(mapMarker({ long, lat }))
      view.graphics.add(currentLocationPoint)
      setGraphic(graphic)
      view.center = [long, lat]
    }).catch(error => console.error(error))

    return function cleanup() {
      view.graphics.remove(graphic)
    }
  }, [lat, long])

  return null
}

Marker.propTypes = {
  lat: PropTypes.number.isRequired,
  long: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
  stroke: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  style: PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'triangle', 'x']),
}

Marker.defaultProps = {
  fill: '#1890ff',
  stroke: '#333',
  size: '8px',
  style: 'circle',
}





