import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { loadModules } from 'esri-loader'
import { Marker } from './'

// custom component for map path
export const Path = ({ view, coordinates, color, width, style }) => {
  const [graphic, setGraphic] = useState(null)

  const mapPath = coordinates => {
    const polyline = {
      type: 'polyline',
      paths: coordinates.map(({ lat, long }) => [long, lat]),
    }
    const lineSymbol = {
      type: 'simple-line',
      color: color,
      width: width,
      style: style,
    }
    return ({
      geometry: polyline,
      symbol: lineSymbol,
    })
  }

  useEffect(() => {
    loadModules(['esri/Graphic']).then(([Graphic]) => {
      let routePath = new Graphic(mapPath(coordinates))
      view.graphics.add(routePath)
      setGraphic(graphic)
    }).catch(error => console.error(error))

    return function cleanup() {
      view.graphics.remove(graphic)
    }
  }, [coordinates, color, width, style])

  return null
}

Path.propTypes = {
  coordinates: PropTypes.arrayOf(
    PropTypes.shape({
      long: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
    })
  ),
  color: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  style: PropTypes.oneOf(['dash', 'dash-dot', 'dot', 'inside-frame', 'long-dash', 'long-dash-dot', 'long-dash-dot-dot', 'none', 'short-dash', 'short-dash-dot', 'short-dash-dot-dot', 'short-dot', 'solid']),
}

Path.defaultProps = {
  color: '#0066cc',
  width: 1,
  style: 'short-dash',
}





