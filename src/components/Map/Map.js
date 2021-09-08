import React, { useContext } from 'react';
import styles from './Map.module.scss';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import { renderCircles } from './../../utils';
import ChangeView from './ChangeView';
import AppContext from './../../context';

function Map({ data, center, zoom, casesType, newCountry }) {
  const { darkMode } = useContext(AppContext);
  console.log(casesType);
  return (
    <div className={styles.wrapper}>
      <MapContainer className={styles.map} center={center} zoom={zoom}>
        {!newCountry && <ChangeView center={center} zoom={zoom} />}
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked={!darkMode} name="Jasny motyw">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked={darkMode} name="Ciemny motyw">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          {renderCircles(data, casesType)}
        </LayersControl>
      </MapContainer>
    </div>
  );
}

export default Map;
