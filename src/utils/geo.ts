import Leaflet from "leaflet";
import type { Project, LngLat, ParcelPolygon } from "../data/projects.types";

export function toLatLng([lng, lat]: LngLat): Leaflet.LatLngExpression {
  return [lat, lng];
}

export function polygonToLatLngs(polygon: ParcelPolygon): Leaflet.LatLngExpression[][] {
  return polygon.coordinates.map((ring) => ring.map(toLatLng));
}

export function getProjectBounds(projects: Project[]): Leaflet.LatLngBounds | null {
  if (projects.length === 0) {
    return null;
  }

  const bounds = Leaflet.latLngBounds([]);

  projects.forEach((project) => {
    bounds.extend(toLatLng(project.coordinates));
    project.parcelPolygon.coordinates[0].forEach((point) => {
      bounds.extend(toLatLng(point));
    });
  });

  return bounds.isValid() ? bounds : null;
}
