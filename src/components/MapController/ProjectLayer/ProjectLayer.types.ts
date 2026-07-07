import type Leaflet from "leaflet";

export interface ProjectLayerProps {
	map: Leaflet.Map | null;
	showParcels: boolean;
	showMarkers: boolean;
}
