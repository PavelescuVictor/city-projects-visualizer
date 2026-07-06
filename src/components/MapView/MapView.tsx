import Leaflet from "leaflet";
import { Info, Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./MapView.css";
import { getProjectBounds, toLatLng } from "../../utils/geo";
import { CreateProjectLayer, createProjectDraftFromCenter } from "../CreateProjectLayer";
import { ProjectLayer } from "../ProjectLayer";
import type { MapViewProps } from "./MapView.types";

const defaultCenter: Leaflet.LatLngExpression = [46.7712, 23.6236];

const MapView = (props: MapViewProps) => {
	const {
		projects,
		allProjects,
		selectedProjectId,
		focusProjectId,
		focusSignal,
		showParcels,
		showMarkers,
		editMode,
		createMode,
		canEdit,
		createDraft,
		resetSignal,
		onProjectSelect,
		onProjectChange,
		onCreateDraftChange,
		onProjectEdit,
		onProjectDeleteRequest,
		onCameraChangedByUser,
	} = props;

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
			center: defaultCenter,
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
		if (!map || initialFitDoneRef.current || allProjects.length === 0) {
			return;
		}

		const bounds = getProjectBounds(allProjects);

		if (bounds) {
			suppressCameraChangeUntilRef.current = Date.now() + 300;
			map.fitBounds(bounds, {
				animate: false,
				paddingTopLeft: [36, 36],
				paddingBottomRight: [36, 36],
				maxZoom: 14,
			});
		} else {
			map.setView(defaultCenter, 12);
		}

		initialFitDoneRef.current = true;
	}, [map, allProjects]);

	useEffect(() => {
		if (!map || resetSignal === 0) {
			return;
		}

		const bounds = getProjectBounds(allProjects);

		if (bounds) {
			suppressCameraChangeUntilRef.current = Date.now() + 900;
			map.fitBounds(bounds, {
				animate: true,
				paddingTopLeft: [36, 36],
				paddingBottomRight: [36, 36],
				maxZoom: 14,
			});
		} else {
			map.setView(defaultCenter, 12);
		}
	}, [map, allProjects, resetSignal]);

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

		const project = allProjects.find(item => item.id === focusProjectId);

		if (project) {
			suppressCameraChangeUntilRef.current = Date.now() + 700;
			map.flyTo(toLatLng(project.coordinates), Math.max(map.getZoom(), 16), {
				animate: true,
				duration: 0.55,
			});
		}
	}, [map, allProjects, focusProjectId, focusSignal]);

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
			<ProjectLayer
				map={map}
				projects={projects}
				selectedProjectId={selectedProjectId}
				showParcels={showParcels}
				showMarkers={showMarkers}
				editMode={editMode}
				canEdit={canEdit}
				onProjectSelect={onProjectSelect}
				onProjectChange={onProjectChange}
				onProjectEdit={onProjectEdit}
				onProjectDeleteRequest={onProjectDeleteRequest}
			/>
			{canEdit && createMode ? (
				<CreateProjectLayer map={map} draft={createDraft} onDraftChange={onCreateDraftChange} />
			) : null}
		</>
	);
};

export default MapView;
