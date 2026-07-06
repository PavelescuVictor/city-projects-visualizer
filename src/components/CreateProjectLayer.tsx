import { useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import { MarkerIcon } from "./MarkerIcon";
import { projectTypeMeta } from "../data/projects";
import { polygonToLatLngs, toLatLng } from "../utils/geo";
import type { CreateProjectDraft, LngLat } from "../types/project";

interface CreateProjectLayerProps {
  map: L.Map | null;
  draft: CreateProjectDraft | null;
  onDraftChange: (draft: CreateProjectDraft) => void;
}

const createTypeMeta = projectTypeMeta.building;
const triangleRadiusMeters = 85;

function createMarkerIcon() {
  return L.divIcon({
    className: "project-marker-wrapper",
    html: `
      <span class="project-marker is-selected create-project-marker" style="--marker-color: ${createTypeMeta.color}">
        ${renderToStaticMarkup(<MarkerIcon type="building" />)}
      </span>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function editHandleIcon() {
  return L.divIcon({
    className: "edit-handle-wrapper",
    html: '<span class="parcel-vertex-handle create-project-vertex-handle"></span>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function toLngLat(latLng: L.LatLng): LngLat {
  return [Number(latLng.lng.toFixed(6)), Number(latLng.lat.toFixed(6))];
}

function closeRing(points: LngLat[]): LngLat[] {
  if (points.length === 0) {
    return [];
  }

  return [...points, points[0]];
}

function cloneRing(points: LngLat[]): LngLat[] {
  return points.map(([lng, lat]) => [lng, lat]);
}

function getEditableRing(draft: CreateProjectDraft): LngLat[] {
  const ring = draft.parcelPolygon.coordinates[0] ?? [];
  return ring.length > 1 ? ring.slice(0, -1) : ring;
}

function updateDraftRing(draft: CreateProjectDraft, ring: LngLat[]): CreateProjectDraft {
  const nextRing = cloneRing(ring);

  return {
    ...draft,
    parcelPolygon: {
      ...draft.parcelPolygon,
      coordinates: [closeRing(nextRing)],
    },
  };
}

function updatePolygonLatLngs(polygon: L.Polygon, ring: LngLat[]) {
  polygon.setLatLngs([closeRing(ring).map(toLatLng)]);
}

function triangleAround(center: L.LatLng): LngLat[] {
  const lngMeters = 111_320 * Math.cos((center.lat * Math.PI) / 180);
  const angles = [-90, 30, 150];

  return angles.map((angle) => {
    const radians = (angle * Math.PI) / 180;
    const lng = center.lng + (Math.cos(radians) * triangleRadiusMeters) / lngMeters;
    const lat = center.lat + (Math.sin(radians) * triangleRadiusMeters) / 111_320;

    return [Number(lng.toFixed(6)), Number(lat.toFixed(6))];
  });
}

export function createProjectDraftFromCenter(center: L.LatLng): CreateProjectDraft {
  const ring = triangleAround(center);

  return {
    name: "",
    neighbourhood: "",
    address: "",
    websiteUrl: "",
    coordinates: toLngLat(center),
    parcelPolygon: {
      type: "Polygon",
      coordinates: [closeRing(ring)],
    },
  };
}

export function CreateProjectLayer({ map, draft, onDraftChange }: CreateProjectLayerProps) {
  useEffect(() => {
    if (!map || !draft) {
      return;
    }

    const layerGroup = L.layerGroup().addTo(map);
    const ring = getEditableRing(draft);
    const liveRing = cloneRing(ring);

    const polygon = L.polygon(polygonToLatLngs(draft.parcelPolygon), {
      color: createTypeMeta.color,
      fillColor: createTypeMeta.fill,
      fillOpacity: 0.42,
      opacity: 0.98,
      weight: 4,
    }).addTo(layerGroup);

    const commitRingChange = (nextRing: LngLat[]) => {
      const committedRing = cloneRing(nextRing);

      liveRing.splice(0, liveRing.length, ...committedRing);
      updatePolygonLatLngs(polygon, committedRing);
      onDraftChange(updateDraftRing(draft, committedRing));
    };

    const marker = L.marker(toLatLng(draft.coordinates), {
      draggable: true,
      icon: createMarkerIcon(),
      title: "Move new project marker",
      riseOnHover: true,
    });

    marker.on("dragend", () => {
      onDraftChange({
        ...draft,
        coordinates: toLngLat(marker.getLatLng()),
      });
    });

    marker.addTo(layerGroup);

    liveRing.forEach((point, index) => {
      const vertexMarker = L.marker(toLatLng(point), {
        draggable: true,
        icon: editHandleIcon(),
        keyboard: false,
        title: "Move parcel point",
        zIndexOffset: 1000,
      });

      vertexMarker.on("drag", () => {
        liveRing[index] = toLngLat(vertexMarker.getLatLng());
        updatePolygonLatLngs(polygon, liveRing);
      });

      vertexMarker.on("dragend", () => {
        const nextRing = cloneRing(liveRing);
        nextRing[index] = toLngLat(vertexMarker.getLatLng());
        commitRingChange(nextRing);
      });

      vertexMarker.addTo(layerGroup);
    });

    return () => {
      layerGroup.remove();
    };
  }, [map, draft, onDraftChange]);

  return null;
}
