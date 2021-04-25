import React from 'react'
import { Map as EsriMap } from '@esri/react-arcgis'
import { Marker } from './marker'

const ncCenter = { lat: 35.393809, long: -79.8431 }

export const Map = ({ points }) => {
  return (
    <div className="route-table-map">
      <EsriMap
        style={{ overflow: 'hidden' }}
        mapProperties={{ basemap: 'gray-vector' }}
        viewProperties={{
          center: [ncCenter.long, ncCenter.lat],
          zoom: 7
      }}>
        { points.map(({ long, lat }) => <Marker key={ `${ long },${ lat }` } long={ long } lat={ lat } />) }
      </EsriMap>
    </div>
  )
}
