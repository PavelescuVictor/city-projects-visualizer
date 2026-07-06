import type { ReactNode } from "react";
import type { Project } from "../../data/projects.types";

export interface DeleteConfirmModalProviderProps {
	children: ReactNode;
}

export interface DeleteConfirmModalProps {
	project: Project;
	onCancel: () => void;
	onConfirm: () => void;
}

export interface DeleteConfirmModalContextValue {
	confirmProjectDelete: (project: Project) => Promise<boolean>;
}
