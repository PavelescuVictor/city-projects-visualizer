import type { CreateProjectDraft, Project } from "../../data/projects.types";

export interface ProjectDetailsPanelProps {
	selectedProject?: Project;
	focusedProjectId: string;
	createDraft: CreateProjectDraft | null;
	createSaveStatus: "idle" | "saving" | "saved" | "error";
	onProjectFocus: (project: Project) => void;
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
