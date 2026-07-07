import type { ReactNode } from "react";
import type { CreateProjectDraft, Project, ProjectStatus } from "../../data/projects.types";

export type ProjectSaveStatus = "idle" | "saving" | "saved" | "error";

export interface ProjectFocusRequest {
	projectId: string;
	requestId: number;
}

export interface ProjectDataContextValue {
	projects: Project[];
	filteredProjects: Project[];
	selectedProject?: Project;
	statuses: ProjectStatus[];
	activeStatuses: ProjectStatus[];
	searchTerm: string;
	focusedProjectId: string;
	hasUnsavedChanges: boolean;
	saveStatus: ProjectSaveStatus;
	createSaveStatus: ProjectSaveStatus;
}

export interface ProjectSearchFiltersContextValue {
	searchTerm: string;
	activeStatuses: ProjectStatus[];
	statuses: ProjectStatus[];
	onSearchChange: (value: string) => void;
	onStatusToggle: (status: ProjectStatus) => void;
}

export interface ProjectEditingContextValue {
	createDraft: CreateProjectDraft | null;
	createSaveStatus: ProjectSaveStatus;
	hasUnsavedChanges: boolean;
	saveStatus: ProjectSaveStatus;
	onCreateDraftChange: (draft: CreateProjectDraft) => void;
	onCreateProject: () => void;
	onCreateSave: () => void;
	onCreateCancel: () => void;
	onProjectChange: (project: Project) => void;
	onProjectEdit: (project: Project) => void;
	onProjectDeleteRequest: (project: Project) => void;
	onSaveProjects: () => void;
	onRevertProjects: () => void;
}

export interface ProjectMapStateContextValue {
	focusProjectId: string;
	focusSignal: number;
	resetSignal: number;
	onProjectSelect: (project: Project) => void;
	onProjectFocus: (project: Project) => void;
	onProjectToggleFocus: (project: Project) => void;
	onCameraChangedByUser: () => void;
	onReset: () => void;
}

export interface ProjectsContextValue
	extends ProjectDataContextValue,
		ProjectSearchFiltersContextValue,
		ProjectEditingContextValue,
		ProjectMapStateContextValue {}

export interface ProjectsProviderProps {
	children: ReactNode;
}
