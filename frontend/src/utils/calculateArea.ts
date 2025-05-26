// utils/calculateArea.ts
import { LatLngExpression } from "leaflet";
import * as turf from "@turf/turf";

export function calculateAreaInSqMeters(polygon: LatLngExpression[]): number {
  const coordinates = polygon.map(({ lat, lng }) => [lng, lat]);
  coordinates.push(coordinates[0]); // Close the polygon
  const turfPolygon = turf.polygon([[...coordinates]]);
  return turf.area(turfPolygon);
}

export const convertSqMetersToSqFeet = (sqMeters: number): number =>
  sqMeters * 10.7639;

export const convertSqMetersToAcres = (sqMeters: number): number =>
  sqMeters / 4046.85642;

export const convertSQMetersToHectares = (sqMeters: number): number =>
  sqMeters / 10000;