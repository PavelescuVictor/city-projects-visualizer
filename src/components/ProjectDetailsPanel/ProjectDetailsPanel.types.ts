import type { CreateProjectDraft, Project } from "../../data/projects.types";

export interface ProjectDetailsPanelProps {
	selectedProject?: Project;
	focusedProjectId: string;
	isCreateMode: boolean;
	createDraft: CreateProjectDraft | null;
	createSaveStatus: "idle" | "saving" | "saved" | "error";
	canEdit: boolean;
	onProjectFocus: (project: Project) => void;
	isEditMode: boolean;
	hasUnsavedChanges: boolean;
	saveStatus: "idle" | "saving" | "saved" | "error";
	onCreateDraftChange: (draft: CreateProjectDraft) => void;
	onCreateSave: () => void;
	onCreateCancel: () => void;
	onProjectEdit: (project: Project) => void;
	onProjectDeleteRequest: (project: Project) => void;
	onSaveProjects: () => void;
	onRevertProjects: () => void;
}
