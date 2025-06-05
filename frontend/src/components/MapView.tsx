import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { useEffect } from 'react';
import L from 'leaflet';
import FitBoundsHelper from '../utils/FitBoundsHelper';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import { calculateAreaInSqMeters } from '../utils/calculateArea';
import { usePlotStore } from '../store/usePlotStore';

type LatLngObject = {
  lat: number;
  lng: number;
};

type MapViewProps = {
  polygons?: string;
};

const mapStyles = {
  mapContainer: {
    height: '100%',
    width: '100%',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    zIndex: 1,
  },
};

export default function MapView({ polygons }: MapViewProps) {
  const setAreaInSqMeters = usePlotStore((state) => state.setAreaInSqMeters);

  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: icon,
      iconUrl: icon,
      shadowUrl: iconShadow,
    });
  }, []);

  let parsedPoints: LatLngObject[] = [];
  try {
    parsedPoints = typeof polygons === 'string' ? JSON.parse(polygons) : polygons || [];
    console.log('Parsed points:', parsedPoints);
  } catch (err) {
    console.error("Invalid polygon JSON:", err);
  }

  const leafletPolygon: [number, number][] = parsedPoints.map(p => [p.lat, p.lng]);

  useEffect(() => {
    if (leafletPolygon.length > 2) {
      const area = calculateAreaInSqMeters(leafletPolygon);
      setAreaInSqMeters(area);
    }
  }, [JSON.stringify(leafletPolygon)]); // Recalculate if polygon changes

  const fallbackPosition: [number, number] = [14.5995, 120.9842];

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={fallbackPosition}
        zoom={18}
        scrollWheelZoom={false}
        style={mapStyles.mapContainer}
      >
        <TileLayer  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"/>
        {leafletPolygon.length > 0 && (
          <>
            <Polygon pathOptions={{ color: 'yellow' }} positions={leafletPolygon} />
            <FitBoundsHelper bounds={leafletPolygon} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
