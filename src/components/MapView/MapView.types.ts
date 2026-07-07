import type { CreateProjectDraft, Project } from "../../data/projects.types";

export interface MapViewProps {
	projects: Project[];
	allProjects: Project[];
	selectedProjectId?: string;
	focusProjectId: string;
	focusSignal: number;
	showParcels: boolean;
	showMarkers: boolean;
	createDraft: CreateProjectDraft | null;
	resetSignal: number;
	onProjectSelect: (project: Project) => void;
	onProjectChange: (project: Project) => void;
	onCreateDraftChange: (draft: CreateProjectDraft) => void;
	onProjectEdit: (project: Project) => void;
	onProjectDeleteRequest: (project: Project) => void;
	onCameraChangedByUser: () => void;
}
