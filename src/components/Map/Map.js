import React from 'react';
import styles from './Map.module.scss';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import { renderCircles } from './../../utils';
import ChangeView from './ChangeView';

function Map({ data, center, zoom, casesType, newCountry }) {
  return (
    <div className={styles.wrapper}>
    <MapContainer className={styles.map} center={center} zoom={zoom}>
    {!newCountry && <ChangeView center={center} zoom={zoom} />}
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {renderCircles(data, casesType)}
    </MapContainer>
    </div>
  );
}

export default Map;
