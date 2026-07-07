import type { CreateProjectDraft, Project, ProjectStatus } from "../../data/projects.types";

export interface SideControllerProps {
	projects: Project[];
	selectedProject?: Project;
	focusedProjectId: string;
	statuses: ProjectStatus[];
	activeStatuses: ProjectStatus[];
	searchTerm: string;
	createDraft: CreateProjectDraft | null;
	createSaveStatus: "idle" | "saving" | "saved" | "error";
	hasUnsavedChanges: boolean;
	saveStatus: "idle" | "saving" | "saved" | "error";
	onSearchChange: (value: string) => void;
	onCreateProject: () => void;
	onStatusToggle: (status: ProjectStatus) => void;
	onProjectSelect: (project: Project) => void;
	onProjectFocus: (project: Project) => void;
	onCreateDraftChange: (draft: CreateProjectDraft) => void;
	onCreateSave: () => void;
	onCreateCancel: () => void;
	onProjectEdit: (project: Project) => void;
	onProjectDeleteRequest: (project: Project) => void;
	onSaveProjects: () => void;
	onRevertProjects: () => void;
}
