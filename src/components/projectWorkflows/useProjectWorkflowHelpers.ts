import { useCallback } from "react";
import {
	APP_STATES,
	useAppMode,
	useAppStateActions,
	useMapActions,
	useProjectEditing,
	useProjectEditingActions,
	useProjects,
	useProjectsActions,
} from "../../contexts";
import { pushCleanProjectUrl } from "../../contexts/ProjectsContext/projectUrl";

function useClearProjectSelection() {
	const { setSelectedProjectId } = useProjectsActions();
	const { clearProjectFocus } = useMapActions();
	const { switchToViewState } = useAppStateActions();

	return useCallback(
		(syncUrl = true) => {
			if (syncUrl) {
				pushCleanProjectUrl();
			}

			setSelectedProjectId("");
			switchToViewState();
			clearProjectFocus();
		},
		[clearProjectFocus, setSelectedProjectId, switchToViewState],
	);
}

function useCloseCreateMode() {
	const appState = useAppMode();
	const { switchToViewState } = useAppStateActions();
	const { setCreateDraft, setCreateSaveStatus } = useProjectEditingActions();

	return useCallback(() => {
		if (appState === APP_STATES.CREATE) {
			switchToViewState();
		}

		setCreateDraft(null);
		setCreateSaveStatus("idle");
	}, [appState, setCreateDraft, setCreateSaveStatus, switchToViewState]);
}

function useDiscardUnsavedEditChanges() {
	const appState = useAppMode();
	const { savedProjects } = useProjects();
	const { setProjects } = useProjectsActions();
	const { hasUnsavedChanges } = useProjectEditing();
	const { setHasUnsavedChanges, setSaveStatus } = useProjectEditingActions();

	return useCallback(() => {
		if (appState !== APP_STATES.EDIT || !hasUnsavedChanges) {
			return;
		}

		setProjects(savedProjects);
		setHasUnsavedChanges(false);
		setSaveStatus("idle");
	}, [appState, hasUnsavedChanges, savedProjects, setHasUnsavedChanges, setProjects, setSaveStatus]);
}

export { useClearProjectSelection, useCloseCreateMode, useDiscardUnsavedEditChanges };
