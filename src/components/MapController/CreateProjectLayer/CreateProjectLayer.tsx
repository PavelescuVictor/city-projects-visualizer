import Leaflet from "leaflet";
import { useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import "./CreateProjectLayer.css";
import { useProjectEditing } from "../../../contexts";
import { PROJECT_TYPES } from "../../../data/projects";
import type { CreateProjectDraft, LngLat, ProjectType } from "../../../data/projects.types";
import { polygonToLatLngs, toLatLng } from "../../../utils/geo";
import { MarkerIcon } from "../MarkerIcon";
import type { CreateProjectLayerProps } from "./CreateProjectLayer.types";

const createProjectLayerStyles: Record<ProjectType, { color: string; fill: string }> = {
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

const createProjectStyle = createProjectLayerStyles[PROJECT_TYPES.BUILDING];
const triangleRadiusMeters = 85;

function createMarkerIcon() {
	return Leaflet.divIcon({
		className: "project-marker-wrapper",
		html: `
      <span class="project-marker is-selected create-project-marker" style="--marker-color: ${createProjectStyle.color}">
        ${renderToStaticMarkup(<MarkerIcon type="building" />)}
      </span>
    `,
		iconSize: [34, 34],
		iconAnchor: [17, 17],
	});
}

function editHandleIcon() {
	return Leaflet.divIcon({
		className: "edit-handle-wrapper",
		html: '<span class="parcel-vertex-handle create-project-vertex-handle"></span>',
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

function updatePolygonLatLngs(polygon: Leaflet.Polygon, ring: LngLat[]) {
	polygon.setLatLngs([closeRing(ring).map(toLatLng)]);
}

function triangleAround(center: Leaflet.LatLng): LngLat[] {
	const lngMeters = 111_320 * Math.cos((center.lat * Math.PI) / 180);
	const angles = [-90, 30, 150];

	return angles.map(angle => {
		const radians = (angle * Math.PI) / 180;
		const lng = center.lng + (Math.cos(radians) * triangleRadiusMeters) / lngMeters;
		const lat = center.lat + (Math.sin(radians) * triangleRadiusMeters) / 111_320;

		return [Number(lng.toFixed(6)), Number(lat.toFixed(6))];
	});
}

export function createProjectDraftFromCenter(center: Leaflet.LatLng): CreateProjectDraft {
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

const CreateProjectLayer = (props: CreateProjectLayerProps) => {
	const { map } = props;
	const { createDraft, onCreateDraftChange } = useProjectEditing();

	useEffect(() => {
		if (!map || !createDraft) {
			return;
		}

		const layerGroup = Leaflet.layerGroup().addTo(map);
		const ring = getEditableRing(createDraft);
		const liveRing = cloneRing(ring);

		const polygon = Leaflet.polygon(polygonToLatLngs(createDraft.parcelPolygon), {
			color: createProjectStyle.color,
			fillColor: createProjectStyle.fill,
			fillOpacity: 0.42,
			opacity: 0.98,
			weight: 4,
		}).addTo(layerGroup);

		const commitRingChange = (nextRing: LngLat[]) => {
			const committedRing = cloneRing(nextRing);

			liveRing.splice(0, liveRing.length, ...committedRing);
			updatePolygonLatLngs(polygon, committedRing);
			onCreateDraftChange(updateDraftRing(createDraft, committedRing));
		};

		const marker = Leaflet.marker(toLatLng(createDraft.coordinates), {
			draggable: true,
			icon: createMarkerIcon(),
			title: "Move new project marker",
			riseOnHover: true,
		});

		marker.on("dragend", () => {
			onCreateDraftChange({
				...createDraft,
				coordinates: toLngLat(marker.getLatLng()),
			});
		});

		marker.addTo(layerGroup);

		liveRing.forEach((point, index) => {
			const vertexMarker = Leaflet.marker(toLatLng(point), {
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
	}, [map, createDraft, onCreateDraftChange]);

	return null;
};

export default CreateProjectLayer;
