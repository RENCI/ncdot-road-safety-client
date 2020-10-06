import React, { useEffect } from 'react'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './map-view.css'

export const MapView = () => {
  useEffect(() => {
    console.log("HERE");

    const map = L.map('mapid').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([51.5, -0.09]).addTo(map)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup();
  }, [])

  return (
    <>
      <h3>Map</h3>
      <div id='mapid'></div>
    </>
  );
}