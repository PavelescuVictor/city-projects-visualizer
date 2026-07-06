import type { CreateProjectDraft, Project } from "../../data/projects.types";

export interface MapControllerProps {
	projects: Project[];
	allProjects: Project[];
	selectedProject?: Project;
	focusProjectId: string;
	focusSignal: number;
	editMode: boolean;
	createMode: boolean;
	canEdit: boolean;
	createDraft: CreateProjectDraft | null;
	resetSignal: number;
	onProjectSelect: (project: Project) => void;
	onProjectChange: (project: Project) => void;
	onCreateDraftChange: (draft: CreateProjectDraft) => void;
	onProjectEdit: (project: Project) => void;
	onProjectDeleteRequest: (project: Project) => void;
	onCameraChangedByUser: () => void;
	onReset: () => void;
}
