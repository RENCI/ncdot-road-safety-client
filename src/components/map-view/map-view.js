import React, { useState, useEffect, useRef } from 'react'
import { Spin, Space, Select } from 'antd'
import { loadModules } from 'esri-loader'
import { RoutesContext } from '../../contexts'
import './map-view.css'

const { Option } = Select;

const ncLatLong = [
  [33.7666, -84.3201], 
  [36.588, -75.4129]
];

const routesGeoJSON = '/static/rs_core/gis/NCRural2LanePrimaryRoads.geojson'

// Handles to arcgis objects needed in callbacks
let view = null
let layerView = null
let autoCenter = false

export const MapView = ({ height }) => {
  const [loading, setLoading] = useState(true)
  const [routeNames, setRouteNames] = useState([])
  //const [center, setCenter] = useState(true)
  const mapRef = useRef()

  useEffect(() => {
    loadModules(
      [
        'esri/Map', 
        'esri/views/MapView', 
        'esri/geometry/Extent',
        'esri/layers/GeoJSONLayer',
        'esri/smartMapping/statistics/uniqueValues'
      ], 
      { css: true }
    ).then(([ArcGISMap, MapView, Extent, GeoJSONLayer, uniqueValues]) => {
      const map = new ArcGISMap({
        basemap: 'gray-vector'
      })

      view = new MapView({
        container: mapRef.current,
        map: map
      })

      view.extent = new Extent({
        xmin: ncLatLong[0][1],
        ymin: ncLatLong[0][0], 
        xmax: ncLatLong[1][1], 
        ymax: ncLatLong[1][0]
      })

      view.on('pointer-down', () => {
        autoCenter = false
      })

      view.on('mouse-wheel', () => {
        autoCenter = false
      })

      const layer = new GeoJSONLayer({
        url: routesGeoJSON
      })

      map.add(layer)

      view.whenLayerView(layer).then(layer_view => {
        layerView = layer_view;

        layerView.watch("updating", value => {
          if (autoCenter) {
            if (!value) {
              layerView.queryExtent().then(response => {
                if (response.extent) {
                  view.goTo(response.extent)
                }
              });
            }    
          }
        });

        // Get route names
        uniqueValues({
          layer: layer,
          field: "RouteName"
        }).then(response => {
          setRouteNames(response.uniqueValueInfos.map(({ value }) => value))
        })

        setLoading(false);
      })

      return () => {
        if (view) {
          view.container = null;
        }
      }
    });
  }, []);

  const handleRouteSelect = value => {
    autoCenter = true

    layerView.filter = value ? {
      where: "RouteName = '" + value + "'"
    } : null        
  }

  return (
    <>
      <h3>Map</h3>
      { loading ? 
        <div className='spinDiv'>
          <Spin tip='Loading...'/>
        </div> 
      :
        <Space>
          <Select
            className='routeSelect'
            showSearch
            allowClear
            placeholder='Filter routes'
            onChange={ handleRouteSelect }
          >
            {routeNames.map((name, i) => (
              <Option key={ i } value={ name }>
                { name }
              </Option>
            ))}
          </Select> 
        </Space>
      }
      <div 
        className='webmap routeMap' 
        style={{ height: height, visibility: loading ? 'hidden' : null }} 
        ref={mapRef} />
    </>
  )
}