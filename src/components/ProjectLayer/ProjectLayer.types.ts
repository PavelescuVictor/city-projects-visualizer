import type Leaflet from "leaflet";
import type { Project } from "../../data/projects.types";

export interface ProjectLayerProps {
	map: Leaflet.Map | null;
	projects: Project[];
	selectedProjectId?: string;
	showParcels: boolean;
	showMarkers: boolean;
	editMode: boolean;
	canEdit: boolean;
	onProjectSelect: (project: Project) => void;
	onProjectChange: (project: Project) => void;
	onProjectEdit: (project: Project) => void;
	onProjectDeleteRequest: (project: Project) => void;
}
