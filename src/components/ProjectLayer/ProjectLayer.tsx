import { useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Leaflet from "leaflet";
import "./ProjectLayer.css";
import { PROJECT_TYPES } from "../../data/projects";
import { useDeleteConfirmModal } from "../DeleteConfirmModal";
import { MarkerIcon } from "../MarkerIcon";
import { polygonToLatLngs, toLatLng } from "../../utils/geo";
import type { Project, LngLat, ProjectType } from "../../data/projects.types";
import type { ProjectLayerProps } from "./ProjectLayer.types";

const projectTypeLayerStyles: Record<ProjectType, { color: string; fill: string }> = {
  [PROJECT_TYPES.BUILDING]: {
    color: "#2563eb",
    fill: "#93c5fd",
  },
  [PROJECT_TYPES.PARK]: {
    color: "#047857",
    fill: "#86efac",
  },
  [PROJECT_TYPES.TRANSPORT_INFRASTRUCTURE]: {
    color: "#ea580c",
    fill: "#fdba74",
  },
  [PROJECT_TYPES.PUBLIC_SPACE]: {
    color: "#7c3aed",
    fill: "#c4b5fd",
  },
};

function markerIcon(project: Project, isSelected: boolean) {
  const layerStyle = projectTypeLayerStyles[project.type];

  return Leaflet.divIcon({
    className: "project-marker-wrapper",
    html: `
      <span class="project-marker${isSelected ? " is-selected" : ""}" style="--marker-color: ${layerStyle.color}">
        ${renderToStaticMarkup(<MarkerIcon type={project.type} />)}
      </span>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function popupContent(project: Project, canEdit: boolean) {
  const hasMultipleImages = (project.images ?? []).length > 1;
  const images = (project.images ?? [])
    .map(
      (image) => `
        <div class="map-popup-slide">
          <img
            src="${escapeAttribute(image.src)}"
            alt="${escapeAttribute(image.alt)}"
            loading="lazy"
          />
        </div>
      `,
    )
    .join("");

  return `
    <div class="map-popup" data-project-id="${escapeAttribute(project.id)}">
      ${
        images
          ? `
            <div class="map-popup-carousel" data-carousel-index="0">
              <div class="map-popup-track">${images}</div>
              ${
                hasMultipleImages
                  ? `
                    <button class="map-popup-carousel-button map-popup-carousel-prev" type="button" aria-label="Previous image">‹</button>
                    <button class="map-popup-carousel-button map-popup-carousel-next" type="button" aria-label="Next image">›</button>
                    <span class="map-popup-carousel-count">1/${project.images.length}</span>
                  `
                  : ""
              }
            </div>
          `
          : ""
      }
      <strong>${escapeHtml(project.name)}</strong>
      <span>${escapeHtml(project.neighbourhood)}</span>
      <div class="map-popup-footer">
        <small class="project-status-value">${escapeHtml(project.status)}</small>
        ${
          canEdit
            ? `
              <div class="map-popup-actions">
                <button class="map-popup-action map-popup-edit" type="button" aria-label="Edit project">✎</button>
                <button class="map-popup-action map-popup-delete" type="button" aria-label="Delete project">×</button>
              </div>
            `
            : ""
        }
      </div>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value);
}

function editHandleIcon(className: string) {
  return Leaflet.divIcon({
    className: "edit-handle-wrapper",
    html: `<span class="${className}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function toLngLat(latLng: Leaflet.LatLng): LngLat {
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

function getEditableRing(project: Project): LngLat[] {
  const ring = project.parcelPolygon.coordinates[0] ?? [];
  return ring.length > 1 ? ring.slice(0, -1) : ring;
}

function updateProjectRing(project: Project, ring: LngLat[]): Project {
  const nextRing = cloneRing(ring);

  return {
    ...project,
    parcelPolygon: {
      ...project.parcelPolygon,
      coordinates: [closeRing(nextRing)],
    },
  };
}

function updatePolygonLatLngs(polygon: Leaflet.Polygon, ring: LngLat[]) {
  polygon.setLatLngs([closeRing(ring).map(toLatLng)]);
}

function distanceToSegment(point: Leaflet.Point, start: Leaflet.Point, end: Leaflet.Point) {
  const segmentLengthSquared = start.distanceTo(end) ** 2;

  if (segmentLengthSquared === 0) {
    return point.distanceTo(start);
  }

  const projection =
    ((point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)) /
    segmentLengthSquared;
  const clampedProjection = Math.max(0, Math.min(1, projection));
  const projectedPoint = Leaflet.point(
    start.x + clampedProjection * (end.x - start.x),
    start.y + clampedProjection * (end.y - start.y),
  );

  return point.distanceTo(projectedPoint);
}

function closestSegmentIndex(map: Leaflet.Map, ring: LngLat[], latLng: Leaflet.LatLng) {
  const cursorPoint = map.latLngToLayerPoint(latLng);
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  ring.forEach((point, index) => {
    const nextPoint = ring[(index + 1) % ring.length];
    const start = map.latLngToLayerPoint(Leaflet.latLng(toLatLng(point)));
    const end = map.latLngToLayerPoint(Leaflet.latLng(toLatLng(nextPoint)));
    const distance = distanceToSegment(cursorPoint, start, end);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

function attachPopupControls(
  layer: Leaflet.Layer,
  project: Project,
  onProjectEdit: (project: Project) => void,
  onProjectDeleteRequest: (project: Project) => Promise<void>,
) {
  layer.on("popupopen", (event) => {
    const popupElement = event.popup.getElement();
    const carousel = popupElement?.querySelector<HTMLElement>(".map-popup-carousel");
    const track = popupElement?.querySelector<HTMLElement>(".map-popup-track");
    const slides = popupElement?.querySelectorAll(".map-popup-slide");
    const count = popupElement?.querySelector<HTMLElement>(".map-popup-carousel-count");
    const previous = popupElement?.querySelector<HTMLButtonElement>(".map-popup-carousel-prev");
    const next = popupElement?.querySelector<HTMLButtonElement>(".map-popup-carousel-next");
    const editButton = popupElement?.querySelector<HTMLButtonElement>(".map-popup-edit");
    const deleteButton = popupElement?.querySelector<HTMLButtonElement>(".map-popup-delete");

    editButton?.addEventListener("click", (clickEvent) => {
      clickEvent.stopPropagation();
      onProjectEdit(project);
      event.popup.close();
    });

    deleteButton?.addEventListener("click", (clickEvent) => {
      clickEvent.stopPropagation();
      void onProjectDeleteRequest(project);
      event.popup.close();
    });

    if (!carousel || !track || !slides || slides.length <= 1 || !previous || !next) {
      return;
    }

    const update = (index: number) => {
      const nextIndex = (index + slides.length) % slides.length;
      carousel.dataset.carouselIndex = String(nextIndex);
      track.style.transform = `translateX(-${nextIndex * 100}%)`;

      if (count) {
        count.textContent = `${nextIndex + 1}/${slides.length}`;
      }
    };

    previous.addEventListener("click", (clickEvent) => {
      clickEvent.stopPropagation();
      update(Number(carousel.dataset.carouselIndex ?? "0") - 1);
    });

    next.addEventListener("click", (clickEvent) => {
      clickEvent.stopPropagation();
      update(Number(carousel.dataset.carouselIndex ?? "0") + 1);
    });
  });
}

export function ProjectLayer({
  map,
  projects,
  selectedProjectId,
  showParcels,
  showMarkers,
  editMode,
  canEdit,
  onProjectSelect,
  onProjectChange,
  onProjectEdit,
  onProjectDeleteRequest,
}: ProjectLayerProps) {
  const { confirmProjectDelete } = useDeleteConfirmModal();

  useEffect(() => {
    if (!map) {
      return;
    }

    const layerGroup = Leaflet.layerGroup().addTo(map);

    projects.forEach((project) => {
      const isSelected = project.id === selectedProjectId;
      const layerStyle = projectTypeLayerStyles[project.type];
      let projectPolygon: Leaflet.Polygon | null = null;

      if (showParcels || (editMode && isSelected)) {
        const polygon = Leaflet.polygon(polygonToLatLngs(project.parcelPolygon), {
          color: layerStyle.color,
          fillColor: layerStyle.fill,
          fillOpacity: isSelected ? 0.48 : 0.28,
          opacity: 0.95,
          weight: isSelected ? 4 : 2,
        });

        polygon.bindPopup(popupContent(project, canEdit), { closeButton: false, minWidth: 273, maxWidth: 273 });

        if (canEdit) {
          attachPopupControls(polygon, project, onProjectEdit, async (projectToDelete) => {
            const shouldDelete = await confirmProjectDelete(projectToDelete);

            if (shouldDelete) {
              onProjectDeleteRequest(projectToDelete);
            }
          });
        }

        polygon.on("click", () => onProjectSelect(project));
        polygon.on("mouseover", () => polygon.setStyle({ fillOpacity: 0.5, weight: 4 }));
        polygon.on("mouseout", () =>
          polygon.setStyle({
            fillOpacity: isSelected ? 0.48 : 0.28,
            weight: isSelected ? 4 : 2,
          }),
        );
        polygon.addTo(layerGroup);
        projectPolygon = polygon;
      }

      if (showMarkers || editMode) {
        const marker = Leaflet.marker(toLatLng(project.coordinates), {
          draggable: canEdit && editMode,
          icon: markerIcon(project, isSelected),
          title: project.name,
          riseOnHover: true,
        });

        marker.bindPopup(popupContent(project, canEdit), { closeButton: false, minWidth: 273, maxWidth: 273 });

        if (canEdit) {
          attachPopupControls(marker, project, onProjectEdit, async (projectToDelete) => {
            const shouldDelete = await confirmProjectDelete(projectToDelete);

            if (shouldDelete) {
              onProjectDeleteRequest(projectToDelete);
            }
          });
        }

        marker.on("click", () => onProjectSelect(project));
        marker.on("dragstart", () => onProjectSelect(project));
        marker.on("dragend", () => {
          onProjectChange({
            ...project,
            coordinates: toLngLat(marker.getLatLng()),
          });
        });
        marker.addTo(layerGroup);
      }

      if (canEdit && editMode && isSelected) {
        const ring = getEditableRing(project);
        const liveRing = cloneRing(ring);
        let addPointSegmentIndex = 0;
        let addPointLocation = Leaflet.latLng(toLatLng(liveRing[0]));
        let hideAddPointTimer: number | undefined;
        const addPointMarker = Leaflet.marker(addPointLocation, {
          icon: editHandleIcon("parcel-add-handle"),
          keyboard: false,
          opacity: 0,
          title: "Add parcel point",
          zIndexOffset: 900,
        });
        const boundaryHoverLine = Leaflet.polyline(closeRing(liveRing).map(toLatLng), {
          color: "#11181c",
          opacity: 0.001,
          weight: 18,
          interactive: true,
        });

        const commitRingChange = (nextRing: LngLat[]) => {
          const committedRing = cloneRing(nextRing);

          liveRing.splice(0, liveRing.length, ...committedRing);

          if (projectPolygon) {
            updatePolygonLatLngs(projectPolygon, committedRing);
          }

          boundaryHoverLine.setLatLngs(closeRing(committedRing).map(toLatLng));
          onProjectChange(updateProjectRing(project, committedRing));
        };

        addPointMarker.on("click", (event) => {
          Leaflet.DomEvent.stop(event);

          if (liveRing.length < 2) {
            return;
          }

          const nextRing = cloneRing(liveRing);
          nextRing.splice(addPointSegmentIndex + 1, 0, toLngLat(addPointLocation));
          commitRingChange(nextRing);
        });

        addPointMarker.addTo(layerGroup);

        boundaryHoverLine.on("mousemove", (event) => {
          if (hideAddPointTimer) {
            window.clearTimeout(hideAddPointTimer);
          }

          addPointLocation = event.latlng;
          addPointSegmentIndex = closestSegmentIndex(map, liveRing, event.latlng);
          addPointMarker.setLatLng(addPointLocation);
          addPointMarker.setOpacity(1);
        });

        boundaryHoverLine.on("mouseout", () => {
          hideAddPointTimer = window.setTimeout(() => addPointMarker.setOpacity(0), 120);
        });

        boundaryHoverLine.addTo(layerGroup);

        liveRing.forEach((point, index) => {
          const vertexMarker = Leaflet.marker(toLatLng(point), {
            draggable: true,
            icon: editHandleIcon("parcel-vertex-handle"),
            keyboard: false,
            title: "Move parcel point",
            zIndexOffset: 1000,
          });

          vertexMarker.on("drag", () => {
            liveRing[index] = toLngLat(vertexMarker.getLatLng());

            if (projectPolygon) {
              updatePolygonLatLngs(projectPolygon, liveRing);
            }

            boundaryHoverLine.setLatLngs(closeRing(liveRing).map(toLatLng));
          });

          vertexMarker.on("dragend", () => {
            const nextRing = cloneRing(liveRing);
            nextRing[index] = toLngLat(vertexMarker.getLatLng());
            commitRingChange(nextRing);
          });

          vertexMarker.on("click", () => onProjectSelect(project));
          vertexMarker.on("contextmenu", (event) => {
            event.originalEvent.preventDefault();

            if (liveRing.length <= 3) {
              return;
            }

            const nextRing = liveRing.filter((_, pointIndex) => pointIndex !== index);
            layerGroup.removeLayer(vertexMarker);
            commitRingChange(nextRing);
          });

          vertexMarker.addTo(layerGroup);
        });
      }
    });

    return () => {
      layerGroup.remove();
    };
  }, [
    map,
    projects,
    selectedProjectId,
    showMarkers,
    showParcels,
    editMode,
    canEdit,
    onProjectSelect,
    onProjectChange,
    onProjectEdit,
    onProjectDeleteRequest,
    confirmProjectDelete,
  ]);

  return null;
}
