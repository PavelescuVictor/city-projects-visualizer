import Leaflet from "leaflet";
import { Info, Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./MapView.css";
import {
	APP_STATES,
	useAppMode,
	useEditPermitted,
	useProjectData,
	useProjectEditing,
	useProjectMapState,
} from "../../../contexts";
import { getProjectBounds, toLatLng } from "../../../utils/geo";
import { CreateProjectLayer, createProjectDraftFromCenter } from "../CreateProjectLayer";
import { ProjectLayer } from "../ProjectLayer";
import type { MapViewProps } from "./MapView.types";

const DEFAULT_CENTER: Leaflet.LatLngExpression = [46.7712, 23.6236];

const MapView = (props: MapViewProps) => {
	const { showParcels, showMarkers } = props;
	const { projects } = useProjectData();
	const { createDraft, onCreateDraftChange } = useProjectEditing();
	const { focusProjectId, focusSignal, resetSignal, onCameraChangedByUser } = useProjectMapState();
	const appState = useAppMode();
	const editPermitted = useEditPermitted();
	const createMode = editPermitted && appState === APP_STATES.CREATE;
	const containerRef = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<Leaflet.Map | null>(null);
	const initialFitDoneRef = useRef(false);
	const suppressCameraChangeUntilRef = useRef(0);
	const [map, setMap] = useState<Leaflet.Map | null>(null);
	const [isAttributionOpen, setIsAttributionOpen] = useState(false);

	useEffect(() => {
		if (!containerRef.current || mapRef.current) {
			return;
		}

		const nextMap = Leaflet.map(containerRef.current, {
			center: DEFAULT_CENTER,
			zoom: 12,
			zoomControl: false,
			attributionControl: false,
		});

		Leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 19,
		}).addTo(nextMap);

		mapRef.current = nextMap;
		setMap(nextMap);

		return () => {
			nextMap.remove();
			mapRef.current = null;
			setMap(null);
		};
	}, []);

	useEffect(() => {
		if (!map) {
			return;
		}

		const handleCameraStart = () => {
			if (Date.now() < suppressCameraChangeUntilRef.current) {
				return;
			}

			onCameraChangedByUser();
		};

		map.on("dragstart", handleCameraStart);
		map.on("zoomstart", handleCameraStart);

		return () => {
			map.off("dragstart", handleCameraStart);
			map.off("zoomstart", handleCameraStart);
		};
	}, [map, onCameraChangedByUser]);

	useEffect(() => {
		if (!map || initialFitDoneRef.current || projects.length === 0) {
			return;
		}

		const bounds = getProjectBounds(projects);

		if (bounds) {
			suppressCameraChangeUntilRef.current = Date.now() + 300;
			map.fitBounds(bounds, {
				animate: false,
				paddingTopLeft: [36, 36],
				paddingBottomRight: [36, 36],
				maxZoom: 14,
			});
		} else {
			map.setView(DEFAULT_CENTER, 12);
		}

		initialFitDoneRef.current = true;
	}, [map, projects]);

	useEffect(() => {
		if (!map || resetSignal === 0) {
			return;
		}

		const bounds = getProjectBounds(projects);

		if (bounds) {
			suppressCameraChangeUntilRef.current = Date.now() + 900;
			map.fitBounds(bounds, {
				animate: true,
				paddingTopLeft: [36, 36],
				paddingBottomRight: [36, 36],
				maxZoom: 14,
			});
		} else {
			map.setView(DEFAULT_CENTER, 12);
		}
	}, [map, projects, resetSignal]);

	useEffect(() => {
		if (!map || !createMode || createDraft) {
			return;
		}

		onCreateDraftChange(createProjectDraftFromCenter(map.getCenter()));
	}, [map, createDraft, createMode, onCreateDraftChange]);

	useEffect(() => {
		if (!map || focusSignal === 0 || !focusProjectId) {
			return;
		}

		const project = projects.find(item => item.id === focusProjectId);

		if (project) {
			suppressCameraChangeUntilRef.current = Date.now() + 700;
			map.flyTo(toLatLng(project.coordinates), Math.max(map.getZoom(), 16), {
				animate: true,
				duration: 0.55,
			});
		}
	}, [map, projects, focusProjectId, focusSignal]);

	function handleZoomIn() {
		map?.zoomIn();
	}

	function handleZoomOut() {
		map?.zoomOut();
	}

	return (
		<>
			<div className="map-canvas" data-testid="project-map" ref={containerRef} />
			<section className="map-zoom-controls" aria-label="Map zoom controls">
				<button
					className="icon-button map-zoom-button"
					type="button"
					aria-label="Zoom in"
					title="Zoom in"
					disabled={!map}
					onClick={handleZoomIn}
				>
					<Plus size={18} aria-hidden="true" />
				</button>
				<button
					className="icon-button map-zoom-button"
					type="button"
					aria-label="Zoom out"
					title="Zoom out"
					disabled={!map}
					onClick={handleZoomOut}
				>
					<Minus size={18} aria-hidden="true" />
				</button>
			</section>
			<div className={`map-attribution-control${isAttributionOpen ? " is-open" : ""}`}>
				<button
					className={`icon-button map-attribution-button${isAttributionOpen ? " is-open" : ""}`}
					type="button"
					aria-label={isAttributionOpen ? "Hide map attribution" : "Show map attribution"}
					aria-expanded={isAttributionOpen}
					onClick={() => setIsAttributionOpen(current => !current)}
				>
					<Info size={17} aria-hidden="true" />
				</button>
				<div className="map-attribution-popover" role="note" aria-hidden={!isAttributionOpen}>
					Map data from{" "}
					<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
						OpenStreetMap
					</a>
				</div>
			</div>
			<ProjectLayer map={map} showParcels={showParcels} showMarkers={showMarkers} />
			{createMode ? <CreateProjectLayer map={map} /> : null}
		</>
	);
};

export default MapView;
