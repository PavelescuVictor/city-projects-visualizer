import L from "leaflet";
import type { DevelopmentProject, LngLat, ParcelPolygon } from "../types/project";

export function toLatLng([lng, lat]: LngLat): L.LatLngExpression {
  return [lat, lng];
}

export function polygonToLatLngs(polygon: ParcelPolygon): L.LatLngExpression[][] {
  return polygon.coordinates.map((ring) => ring.map(toLatLng));
}

export function getProjectBounds(projects: DevelopmentProject[]): L.LatLngBounds | null {
  if (projects.length === 0) {
    return null;
  }

  const bounds = L.latLngBounds([]);

  projects.forEach((project) => {
    bounds.extend(toLatLng(project.coordinates));
    project.parcelPolygon.coordinates[0].forEach((point) => bounds.extend(toLatLng(point)));
  });

  return bounds.isValid() ? bounds : null;
}
