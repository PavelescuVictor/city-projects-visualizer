import { useState } from "react";
import { MapFilterToggles } from "./MapFilterToggles";
import { MapResetButton } from "./MapResetButton";
import { MapView } from "./MapView";
import "./MapController.css";

const MapController = () => {
	const [showParcels, setShowParcels] = useState(true);
	const [showMarkers, setShowMarkers] = useState(true);

	return (
		<section className="map-stage" aria-label="City development map">
			<MapView showParcels={showParcels} showMarkers={showMarkers} />
			<MapFilterToggles
				showParcels={showParcels}
				showMarkers={showMarkers}
				onShowParcelsChange={setShowParcels}
				onShowMarkersChange={setShowMarkers}
			/>
			<MapResetButton />
		</section>
	);
};

export default MapController;
