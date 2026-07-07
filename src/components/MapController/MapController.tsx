import { useState } from "react";
import { useProjectData, useProjectEditing, useProjectMapState } from "../../contexts";
import { MapFilterToggles } from "./MapFilterToggles";
import { MapResetButton } from "./MapResetButton";
import { MapView } from "./MapView";
import "./MapController.css";
import type { MapControllerProps } from "./MapController.types";

const MapController = (_props: MapControllerProps) => {
	const { projects, filteredProjects, selectedProject } = useProjectData();
	const { createDraft, onCreateDraftChange, onProjectChange, onProjectDeleteRequest, onProjectEdit } =
		useProjectEditing();
	const { focusProjectId, focusSignal, resetSignal, onCameraChangedByUser, onProjectSelect, onReset } =
		useProjectMapState();
	const [showParcels, setShowParcels] = useState(true);
	const [showMarkers, setShowMarkers] = useState(true);

	return (
		<section className="map-stage" aria-label="City development map">
			<MapView
				projects={filteredProjects}
				allProjects={projects}
				selectedProjectId={selectedProject?.id}
				focusProjectId={focusProjectId}
				focusSignal={focusSignal}
				showParcels={showParcels}
				showMarkers={showMarkers}
				createDraft={createDraft}
				resetSignal={resetSignal}
				onProjectSelect={onProjectSelect}
				onProjectChange={onProjectChange}
				onCreateDraftChange={onCreateDraftChange}
				onProjectEdit={onProjectEdit}
				onProjectDeleteRequest={onProjectDeleteRequest}
				onCameraChangedByUser={onCameraChangedByUser}
			/>
			<MapFilterToggles
				showParcels={showParcels}
				showMarkers={showMarkers}
				onShowParcelsChange={setShowParcels}
				onShowMarkersChange={setShowMarkers}
			/>
			<MapResetButton onReset={onReset} />
		</section>
	);
};

export default MapController;
