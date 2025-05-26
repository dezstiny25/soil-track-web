// components/FitBoundsHelper.tsx
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

type FitBoundsHelperProps = {
  bounds: [number, number][];
};

export default function FitBoundsHelper({ bounds }: FitBoundsHelperProps) {
  const map = useMap();

  useEffect(() => {
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [bounds, map]);

  return null;
}
