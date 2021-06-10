import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Map as EsriMap } from '@esri/react-arcgis'
import { Select } from 'antd'
import { Marker, Path } from './'
import './map.css'

const { Option } = Select

const ncCenter = { lat: 35.393809, long: -79.8431 }

export const Map = ({ height, markers, path, zoom, basemapSelection = true }) => {
  const [basemap, setBasemap] = useState('gray-vector')
  const handleChangeBasemap = value => setBasemap(value)

  return (
    <div className="map">

      <EsriMap
        key={ basemap }
        style={{ overflow: 'hidden', height: height }}
        mapProperties={{ basemap: basemap }}
        viewProperties={{
          center: [ncCenter.long, ncCenter.lat],
          zoom: zoom,
        }}
      >
        {
          // draw a path if there is one
          path.length && <Path coordinates={ path } />
        }
        {
          // draw any markers
            markers.map(({ key, ...props }, i) => (
              <Marker key={ `marker-${ i }_-${ props.long },${ props.lat }` } { ...props } />
            ))
        }
      </EsriMap>
      {
        basemapSelection && (
          <Select className="basemap-selector" defaultValue="gray-vector" onChange={ handleChangeBasemap }>
            <Option value="dark-gray-vector">Dark Gray Canvas</Option>
            <Option value="gray-vector">Light Gray Canvas</Option>
            <Option value="osm">OpenStreetMap</Option>
            <Option value="satellite">Satellite</Option>
            <Option value="streets">Streets</Option>
            <Option value="topo">Topographic Map</Option>
            <Option value="streets-navigation-vector">World Navigation Map</Option>
            <Option value="streets-night-vector">World Street Map (Night)</Option>
            <Option value="streets-relief-vector">World Street Map (with Relief)</Option>
          </Select>
        )
      }
    </div>
  )
}

Map.propTypes = {
  height: PropTypes.string.isRequired,
  zoom: PropTypes.number.isRequired,
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      long: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
    })
  ),
  path: PropTypes.array,
}

Map.defaultProps = {
  height: '300px',
  zoom: 7,
  markers: [],
  path: [],
}
