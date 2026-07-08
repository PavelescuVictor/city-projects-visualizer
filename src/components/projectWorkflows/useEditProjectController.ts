import { useCallback } from "react";
import {
	APP_STATES,
	useAppMode,
	useAppStateActions,
	useEditPermitted,
	useProjectEditingActions,
	useProjects,
	useProjectsActions,
} from "../../contexts";
import { pushProjectUrl } from "../../contexts/ProjectsContext/projectUrl";
import type { Project } from "../../data/projects.types";
import { useCloseCreateMode } from "./useProjectWorkflowHelpers";

function useEditProjectController() {
	const editPermitted = useEditPermitted();
	const appState = useAppMode();
	const { switchToEditState, switchToViewState } = useAppStateActions();
	const { projects, selectedProjectId } = useProjects();
	const { setProjects, setSelectedProjectId } = useProjectsActions();
	const { setHasUnsavedChanges, setSaveStatus } = useProjectEditingActions();
	const closeCreateMode = useCloseCreateMode();

	const onProjectChange = useCallback(
		(updatedProject: Project) => {
			if (!editPermitted) {
				return;
			}

			setProjects(
				projects.map(project =>
					project.id === updatedProject.id ? { ...project, ...updatedProject } : project,
				),
			);
			setSelectedProjectId(updatedProject.id);
			setHasUnsavedChanges(true);
			setSaveStatus("idle");
		},
		[editPermitted, projects, setHasUnsavedChanges, setProjects, setSaveStatus, setSelectedProjectId],
	);

	const onProjectEdit = useCallback(
		(project: Project) => {
			if (!editPermitted) {
				return;
			}

			closeCreateMode();
			setSelectedProjectId(project.id);
			pushProjectUrl(project.id);

			if (appState === APP_STATES.EDIT && selectedProjectId === project.id) {
				switchToViewState();
				return;
			}

			switchToEditState();
		},
		[
			appState,
			closeCreateMode,
			editPermitted,
			selectedProjectId,
			setSelectedProjectId,
			switchToEditState,
			switchToViewState,
		],
	);

	return {
		onProjectChange,
		onProjectEdit,
	};
}

export { useEditProjectController };
