import React from 'react'
import PropTypes from 'prop-types'
import { Map as EsriMap } from '@esri/react-arcgis'
import { Marker } from './marker'

const ncCenter = { lat: 35.393809, long: -79.8431 }

export const Map = ({ markers }) => {
  return (
    <div className="route-table-map">
      <EsriMap
        style={{ overflow: 'hidden' }}
        mapProperties={{ basemap: 'gray-vector' }}
        viewProperties={{
          center: [ncCenter.long, ncCenter.lat],
          zoom: 7
      }}>
        { markers.map(({ key, ...props }) => <Marker key={ key } { ...props } />) }
      </EsriMap>
    </div>
  )
}

Map.propTypes = {
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      long: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
    })
  )
}
