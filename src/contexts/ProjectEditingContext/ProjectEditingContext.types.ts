import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { CreateProjectDraft } from "../../data/projects.types";

export type ProjectSaveStatus = "idle" | "saving" | "saved" | "error";

export interface ProjectEditingContextValue {
	createDraft: CreateProjectDraft | null;
	createSaveStatus: ProjectSaveStatus;
	hasUnsavedChanges: boolean;
	saveStatus: ProjectSaveStatus;
}

export interface ProjectEditingActionsContextValue {
	setCreateDraft: Dispatch<SetStateAction<CreateProjectDraft | null>>;
	setCreateSaveStatus: Dispatch<SetStateAction<ProjectSaveStatus>>;
	setHasUnsavedChanges: Dispatch<SetStateAction<boolean>>;
	setSaveStatus: Dispatch<SetStateAction<ProjectSaveStatus>>;
}

export interface ProjectEditingProviderProps {
	children: ReactNode;
}
