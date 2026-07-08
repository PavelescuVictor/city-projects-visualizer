import { useCallback } from "react";
import {
	useAppStateActions,
	useEditPermitted,
	useMapActions,
	useProjectEditing,
	useProjectEditingActions,
	useProjects,
	useProjectsActions,
	useSearchFiltersActions,
} from "../../../contexts";
import { createProjectId, normalizeWebsiteUrl } from "../../../contexts/ProjectsContext/ProjectsContext.helpers";
import { pushCleanProjectUrl, pushProjectUrl } from "../../../contexts/ProjectsContext/projectUrl";
import type { Project } from "../../../data/projects.types";
import { useClearProjectSelection, useCloseCreateMode } from "../../../hooks/useProjectWorkflowHelpers";
import { saveProjects } from "../../../services/projectService";

function useCreateProjectController() {
	const editPermitted = useEditPermitted();
	const { switchToCreateState, switchToViewState } = useAppStateActions();
	const { projects } = useProjects();
	const { setProjects, setSavedProjects, setSelectedProjectId } = useProjectsActions();
	const { createDraft } = useProjectEditing();
	const { setActiveStatuses } = useSearchFiltersActions();
	const { setCreateDraft, setCreateSaveStatus } = useProjectEditingActions();
	const { clearProjectFocus } = useMapActions();
	const clearProjectSelection = useClearProjectSelection();
	const closeCreateMode = useCloseCreateMode();

	const onCreateProject = useCallback(() => {
		if (!editPermitted) {
			return;
		}

		switchToCreateState();
		pushCleanProjectUrl();
		setSelectedProjectId("");
		clearProjectFocus();
		setCreateDraft(null);
		setCreateSaveStatus("idle");
	}, [
		clearProjectFocus,
		editPermitted,
		setCreateDraft,
		setCreateSaveStatus,
		setSelectedProjectId,
		switchToCreateState,
	]);

	const onCreateCancel = useCallback(() => {
		closeCreateMode();
		clearProjectSelection();
	}, [clearProjectSelection, closeCreateMode]);

	const onCreateSave = useCallback(async () => {
		if (!editPermitted || !createDraft) {
			return;
		}

		const trimmedName = createDraft.name.trim();
		const trimmedAddress = createDraft.address.trim();
		const trimmedNeighbourhood = createDraft.neighbourhood.trim();
		const websiteUrl = normalizeWebsiteUrl(createDraft.websiteUrl);

		if (!trimmedName || !trimmedAddress || !trimmedNeighbourhood || !websiteUrl) {
			return;
		}

		const newProject: Project = {
			id: createProjectId(trimmedName, projects),
			name: trimmedName,
			type: "building",
			status: "planning",
			address: trimmedAddress,
			neighbourhood: trimmedNeighbourhood,
			websiteUrl,
			images: [],
			coordinates: createDraft.coordinates,
			parcelPolygon: createDraft.parcelPolygon,
		};

		setCreateSaveStatus("saving");

		try {
			const savedProjects = await saveProjects([...projects, newProject]);

			setProjects(savedProjects);
			setSavedProjects(savedProjects);
			setActiveStatuses(current => (current.includes("planning") ? current : [...current, "planning"]));
			setSelectedProjectId(newProject.id);
			pushProjectUrl(newProject.id);
			switchToViewState();
			setCreateDraft(null);
			setCreateSaveStatus("saved");
		} catch {
			setCreateSaveStatus("error");
		}
	}, [
		createDraft,
		editPermitted,
		projects,
		setActiveStatuses,
		setCreateDraft,
		setCreateSaveStatus,
		setProjects,
		setSavedProjects,
		setSelectedProjectId,
		switchToViewState,
	]);

	return {
		onCreateDraftChange: setCreateDraft,
		onCreateProject,
		onCreateSave,
		onCreateCancel,
	};
}

export { useCreateProjectController };
