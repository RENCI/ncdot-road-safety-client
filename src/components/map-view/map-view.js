import React, { useState, useEffect, useRef } from 'react'
import { Spin } from 'antd'
import './map-view.css'

import { loadModules } from 'esri-loader'

const ncLatLong = [
  [33.7666, -84.3201], 
  [36.588, -75.4129]
];

const routesGeoJSON = '/static/rs_core/gis/NCRural2LanePrimaryRoads.geojson'

export const MapView = () => {
  const [loading, setLoading] = useState(true);

  const mapRef = useRef()

  useEffect(() => {
    loadModules(
      [
        'esri/Map', 
        'esri/views/MapView', 
        'esri/geometry/Extent',
        'esri/layers/GeoJSONLayer',
        'esri/views/layers/support/FeatureFilter'
      ], 
      { css: true }
    ).then(([ArcGISMap, MapView, Extent, GeoJSONLayer, FeatureFilter]) => {
      const map = new ArcGISMap({
        basemap: 'gray-vector'
      })

      const view = new MapView({
        container: mapRef.current,
        map: map
      })

      view.extent = new Extent({
        xmin: ncLatLong[0][1],
        ymin: ncLatLong[0][0], 
        xmax: ncLatLong[1][1], 
        ymax: ncLatLong[1][0]
      })

      const layer = new GeoJSONLayer({
        url: routesGeoJSON
      })

      map.add(layer)

      view.whenLayerView(layer).then(layerView => {
        console.log(layer)

        //layerView.filter = new FeatureFilter({
        //  where: 'MPLength > 1'
        //})

        setLoading(false);
      })

      return () => {
        if (view) {
          view.container = null;
        }
      }
    });
  }, []);

  return (
    <>
      <h3>Map</h3>
      { loading ? 
        <div className='spinDiv'>
          <Spin tip='Loading...'/>
        </div> 
      : null }
      <div 
        className='webmap routeMap' 
        style={{ visibility: loading ? 'hidden' : null }} 
        ref={mapRef} />
    </>
  )
}