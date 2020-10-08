import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import * as L from 'leaflet'
import shp from 'shpjs'
import 'leaflet/dist/leaflet.css'
import './map-view.css'

import { loadModules } from 'esri-loader'

const ncLatLong = [
  [33.7666, -84.3201], 
  [36.588, -75.4129]
];

const routesShapeFile = '/static/rs_core/shape/NCRural2LanePrimaryRoads.zip'
const routesGeoJSON = '/static/rs_core/shape/NCRural2LanePrimaryRoads.geojson'

export const MapView = () => {
/*  
  const mapRef = useRef()

  useEffect(() => {
    loadModules(
      [
        'esri/Map', 
        'esri/views/MapView', 
        'esri/geometry/Extent',
        'esri/layers/GeoJSONLayer',
        'esri/request'
      ], 
      { css: true }
    ).then(([ArcGISMap, MapView, Extent, GeoJSONLayer, request]) => {
      const map = new ArcGISMap({
        basemap: 'topo-vector'
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

      shp('/static/rs_core/shape/NCRural2LanePrimaryRoads.zip').then(geojson => {
        console.log(geojson)
  
        const routes = []
  
        geojson.features.forEach(feature => {
          const id = feature.properties.RouteID
          let index = routes.findIndex(route => route.id === id)
  
          if (index === -1) index = routes.push({ id: id, count: 0 }) - 1
  
          routes[index].count += feature.geometry.coordinates.length        
        })
  
        console.log(routes)
        console.log(routes.reduce((p, c) => Math.max(p, c.count), 0))
  
        const layer = new GeoJSONLayer({

        })

        map.add(layer);       
      })          

      return () => {
        if (view) {
          view.container = null;
        }
      }
    });
  });

  return (
    <>
      <h3>Map</h3>
      <div id='mapid' className="webmap" ref={mapRef} ></div>
    </>
  )
*/  
  
  useEffect(() => {
    const map = L.map('mapid').fitBounds([[33.7666, -84.3201], [36.588, -75.4129]])

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

//    shp('/static/rs_core/shape/NCRural2LanePrimaryRoads.zip').then(geojson => {
    axios.get(routesGeoJSON).then(response => {
      const geojson = response.data    

      console.log(geojson)

      const routes = []

      geojson.features.forEach(feature => {
        const id = feature.properties.RouteID
        let index = routes.findIndex(route => route.id === id)

        if (index === -1) index = routes.push({ id: id, count: 0 }) - 1

        routes[index].count += feature.geometry.coordinates.length        
      })

      console.log(routes)
      console.log(routes.reduce((p, c) => Math.max(p, c.count), 0))

      L.geoJSON(geojson).addTo(map)
    })    
  }, [])

  return (
    <>
      <h3>Map</h3>
      <div id='mapid'></div>
    </>
  );
}