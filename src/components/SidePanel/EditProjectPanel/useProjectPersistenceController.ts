import { useCallback } from "react";
import {
	useAppStateActions,
	useEditPermitted,
	useProjectEditingActions,
	useProjects,
	useProjectsActions,
} from "../../../contexts";
import { pushCleanProjectUrl, pushProjectUrl } from "../../../contexts/ProjectsContext/projectUrl";
import { loadProjects, saveProjects } from "../../../services/projectService";

function useProjectPersistenceController() {
	const editPermitted = useEditPermitted();
	const { switchToViewState } = useAppStateActions();
	const { projects, selectedProjectId } = useProjects();
	const { setProjects, setSavedProjects, setSelectedProjectId } = useProjectsActions();
	const { setHasUnsavedChanges, setSaveStatus } = useProjectEditingActions();

	const onSaveProjects = useCallback(async () => {
		if (!editPermitted) {
			return;
		}

		setSaveStatus("saving");

		try {
			const savedProjects = await saveProjects(projects);
			setProjects(savedProjects);
			setSavedProjects(savedProjects);
			setHasUnsavedChanges(false);
			setSaveStatus("saved");
			switchToViewState();
		} catch {
			setSaveStatus("error");
		}
	}, [
		editPermitted,
		projects,
		setHasUnsavedChanges,
		setProjects,
		setSavedProjects,
		setSaveStatus,
		switchToViewState,
	]);

	const onRevertProjects = useCallback(async () => {
		if (!editPermitted) {
			return;
		}

		try {
			const loadedProjects = await loadProjects();
			const nextSelectedProjectId = loadedProjects.some(project => project.id === selectedProjectId)
				? selectedProjectId
				: "";

			setProjects(loadedProjects);
			setSavedProjects(loadedProjects);
			setSelectedProjectId(nextSelectedProjectId);
			if (nextSelectedProjectId) {
				pushProjectUrl(nextSelectedProjectId);
			} else {
				pushCleanProjectUrl();
			}
			setHasUnsavedChanges(false);
			setSaveStatus("idle");
		} catch {
			setSaveStatus("error");
		}
	}, [
		editPermitted,
		selectedProjectId,
		setHasUnsavedChanges,
		setProjects,
		setSavedProjects,
		setSaveStatus,
		setSelectedProjectId,
	]);

	return {
		onSaveProjects,
		onRevertProjects,
	};
}

export { useProjectPersistenceController };
