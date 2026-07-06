import { useState } from "react";
import { MapFilterToggles } from "../MapFilterToggles";
import { MapResetButton } from "../MapResetButton";
import { MapView } from "../MapView";
import "./MapController.css";
import type { MapControllerProps } from "./MapController.types";

const MapController = (props: MapControllerProps) => {
	const {
		projects,
		allProjects,
		selectedProject,
		focusProjectId,
		focusSignal,
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
		onReset,
	} = props;
	const [showParcels, setShowParcels] = useState(true);
	const [showMarkers, setShowMarkers] = useState(true);

	return (
		<section className="map-stage" aria-label="City development map">
			<MapView
				projects={projects}
				allProjects={allProjects}
				selectedProjectId={selectedProject?.id}
				focusProjectId={focusProjectId}
				focusSignal={focusSignal}
				showParcels={showParcels}
				showMarkers={showMarkers}
				editMode={editMode}
				createMode={createMode}
				canEdit={canEdit}
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
