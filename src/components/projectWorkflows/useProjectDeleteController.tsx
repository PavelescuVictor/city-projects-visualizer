import { useCallback } from "react";
import {
	useAppStateActions,
	useConfirmModal,
	useEditPermitted,
	useProjectEditingActions,
	useProjects,
	useProjectsActions,
} from "../../contexts";
import { pushCleanProjectUrl, pushProjectUrl } from "../../contexts/ProjectsContext/projectUrl";
import type { Project } from "../../data/projects.types";
import { saveProjects } from "../../services/projectService";

function useProjectDeleteController() {
	const editPermitted = useEditPermitted();
	const { switchToViewState } = useAppStateActions();
	const { confirm } = useConfirmModal();
	const { projects, selectedProjectId } = useProjects();
	const { setProjects, setSavedProjects, setSelectedProjectId } = useProjectsActions();
	const { setHasUnsavedChanges, setSaveStatus } = useProjectEditingActions();

	const deleteProject = useCallback(
		async (projectToDelete: Project) => {
			const previousProjects = projects;
			const previousSelectedProjectId = selectedProjectId;
			const nextProjects = previousProjects.filter(project => project.id !== projectToDelete.id);
			const nextSelectedProjectId = nextProjects[0]?.id ?? "";

			setProjects(nextProjects);
			setSelectedProjectId(nextSelectedProjectId);
			if (nextSelectedProjectId) {
				pushProjectUrl(nextSelectedProjectId);
			} else {
				pushCleanProjectUrl();
			}
			switchToViewState();
			setHasUnsavedChanges(false);
			setSaveStatus("saving");

			try {
				const savedProjects = await saveProjects(nextProjects);
				const savedSelectedProjectId = savedProjects.some(project => project.id === nextSelectedProjectId)
					? nextSelectedProjectId
					: "";

				setProjects(savedProjects);
				setSavedProjects(savedProjects);
				setSelectedProjectId(savedSelectedProjectId);
				if (savedSelectedProjectId) {
					pushProjectUrl(savedSelectedProjectId);
				} else {
					pushCleanProjectUrl();
				}
				setSaveStatus("saved");
			} catch {
				const restoredSelectedProjectId = previousProjects.some(
					project => project.id === previousSelectedProjectId,
				)
					? previousSelectedProjectId
					: "";

				setProjects(previousProjects);
				setSelectedProjectId(restoredSelectedProjectId);
				if (restoredSelectedProjectId) {
					pushProjectUrl(restoredSelectedProjectId);
				} else {
					pushCleanProjectUrl();
				}
				setSaveStatus("error");
			}
		},
		[
			projects,
			selectedProjectId,
			setHasUnsavedChanges,
			setProjects,
			setSavedProjects,
			setSaveStatus,
			setSelectedProjectId,
			switchToViewState,
		],
	);

	const onProjectDeleteRequest = useCallback(
		async (projectToDelete: Project) => {
			if (!editPermitted) {
				return;
			}

			const shouldDelete = await confirm({
				title: "Delete project?",
				message: (
					<>
						This removes <strong>{projectToDelete.name}</strong> from the local project list.
					</>
				),
				confirmLabel: "Delete",
				variant: "danger",
			});

			if (shouldDelete) {
				await deleteProject(projectToDelete);
			}
		},
		[confirm, deleteProject, editPermitted],
	);

	return {
		onProjectDeleteRequest,
	};
}

export { useProjectDeleteController };
