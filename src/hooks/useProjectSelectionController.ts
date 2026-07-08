import { useCallback } from "react";
import { useAppStateActions, useMapActions, useProjects, useProjectsActions } from "../contexts";
import { pushProjectUrl } from "../contexts/ProjectsContext/projectUrl";
import type { Project } from "../data/projects.types";
import {
	useClearProjectSelection,
	useCloseCreateMode,
	useDiscardUnsavedEditChanges,
} from "./useProjectWorkflowHelpers";

function useProjectSelectionController() {
	const { selectedProjectId } = useProjects();
	const { setSelectedProjectId } = useProjectsActions();
	const { requestMapReset, requestProjectFocus } = useMapActions();
	const { switchToViewState } = useAppStateActions();
	const clearProjectSelection = useClearProjectSelection();
	const closeCreateMode = useCloseCreateMode();
	const discardUnsavedEditChanges = useDiscardUnsavedEditChanges();

	const discardBeforeSelection = useCallback(
		(projectId: string) => {
			if (projectId !== selectedProjectId) {
				discardUnsavedEditChanges();
			}
		},
		[discardUnsavedEditChanges, selectedProjectId],
	);

	const onProjectSelect = useCallback(
		(project: Project) => {
			closeCreateMode();
			discardBeforeSelection(project.id);

			if (project.id !== selectedProjectId) {
				switchToViewState();
			}

			setSelectedProjectId(project.id);
			pushProjectUrl(project.id);
		},
		[closeCreateMode, discardBeforeSelection, selectedProjectId, setSelectedProjectId, switchToViewState],
	);

	const onProjectFocus = useCallback(
		(project: Project) => {
			closeCreateMode();
			discardBeforeSelection(project.id);

			if (project.id !== selectedProjectId) {
				switchToViewState();
			}

			setSelectedProjectId(project.id);
			pushProjectUrl(project.id);
			requestProjectFocus(project.id);
		},
		[
			closeCreateMode,
			discardBeforeSelection,
			requestProjectFocus,
			selectedProjectId,
			setSelectedProjectId,
			switchToViewState,
		],
	);

	const onProjectToggleFocus = useCallback(
		(project: Project) => {
			closeCreateMode();

			if (project.id === selectedProjectId) {
				discardUnsavedEditChanges();
				clearProjectSelection();
				requestMapReset();
				return;
			}

			discardBeforeSelection(project.id);
			switchToViewState();
			setSelectedProjectId(project.id);
			pushProjectUrl(project.id);
			requestProjectFocus(project.id);
		},
		[
			clearProjectSelection,
			closeCreateMode,
			discardBeforeSelection,
			discardUnsavedEditChanges,
			requestMapReset,
			requestProjectFocus,
			selectedProjectId,
			setSelectedProjectId,
			switchToViewState,
		],
	);

	const onReset = useCallback(() => {
		closeCreateMode();
		clearProjectSelection();
		requestMapReset();
	}, [clearProjectSelection, closeCreateMode, requestMapReset]);

	return {
		onProjectSelect,
		onProjectFocus,
		onProjectToggleFocus,
		onReset,
	};
}

export { useProjectSelectionController };
