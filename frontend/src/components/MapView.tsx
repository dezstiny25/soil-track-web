import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import L from 'leaflet';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Add this CSS directly in the component or import from a CSS module
const mapStyles = {
  mapContainer: {
    height: '100%',  
    width: '100%',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    zIndex: 1
  }
};

const position: [number, number] = [14.5995, 120.9842]; // Manila

export default function MapView() {
  // Fix for marker icons on first render
  useEffect(() => {
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: icon,
      iconUrl: icon,
      shadowUrl: iconShadow
    });
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={mapStyles.mapContainer}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            This is your marker location.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}