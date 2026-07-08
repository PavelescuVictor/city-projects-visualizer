import { createContext, useContext, useMemo, useState } from "react";
import type { CreateProjectDraft } from "../../data/projects.types";
import type {
	ProjectEditingActionsContextValue,
	ProjectEditingContextValue,
	ProjectEditingProviderProps,
	ProjectSaveStatus,
} from "./ProjectEditingContext.types";

const ProjectEditingContext = createContext<ProjectEditingContextValue | null>(null);
const ProjectEditingActionsContext = createContext<ProjectEditingActionsContextValue | null>(null);

const ProjectEditingProvider = (props: ProjectEditingProviderProps) => {
	const { children } = props;
	const [createDraft, setCreateDraft] = useState<CreateProjectDraft | null>(null);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [saveStatus, setSaveStatus] = useState<ProjectSaveStatus>("idle");
	const [createSaveStatus, setCreateSaveStatus] = useState<ProjectSaveStatus>("idle");

	const value = useMemo<ProjectEditingContextValue>(
		() => ({
			createDraft,
			createSaveStatus,
			hasUnsavedChanges,
			saveStatus,
		}),
		[createDraft, createSaveStatus, hasUnsavedChanges, saveStatus],
	);

	const actions = useMemo<ProjectEditingActionsContextValue>(
		() => ({
			setCreateDraft,
			setCreateSaveStatus,
			setHasUnsavedChanges,
			setSaveStatus,
		}),
		[],
	);

	return (
		<ProjectEditingActionsContext.Provider value={actions}>
			<ProjectEditingContext.Provider value={value}>{children}</ProjectEditingContext.Provider>
		</ProjectEditingActionsContext.Provider>
	);
};

const useProjectEditing = () => {
	const context = useContext(ProjectEditingContext);

	if (!context) {
		throw new Error("useProjectEditing must be used within ProjectEditingProvider");
	}

	return context;
};

const useProjectEditingActions = () => {
	const context = useContext(ProjectEditingActionsContext);

	if (!context) {
		throw new Error("useProjectEditingActions must be used within ProjectEditingProvider");
	}

	return context;
};

export { ProjectEditingProvider, useProjectEditing, useProjectEditingActions };
export default ProjectEditingProvider;
