import React, { useEffect } from 'react'
import * as L from 'leaflet'
import shp from 'shpjs'
import 'leaflet/dist/leaflet.css'
import './map-view.css'

export const MapView = () => {
  useEffect(() => {
    const map = L.map('mapid').fitBounds([[33.7666, -84.3201], [36.588, -75.4129]])

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)
/*
    shp('/static/rs_core/shape/NCRural2LanePrimaryRoads.zip').then(geojson => {
      console.log(geojson)

      L.geoJSON(geojson).addTo(map);
    })
*/    
  }, [])

  return (
    <>
      <h3>Map</h3>
      <div id='mapid'></div>
    </>
  );
}