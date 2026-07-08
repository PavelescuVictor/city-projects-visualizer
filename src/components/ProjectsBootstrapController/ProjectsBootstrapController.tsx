import { useEffect } from "react";
import {
	useAppStateActions,
	useMapActions,
	useProjectEditingActions,
	useProjects,
	useProjectsActions,
	useSearchFiltersActions,
} from "../../contexts";
import { findProjectById } from "../../contexts/ProjectsContext/ProjectsContext.helpers";
import { getProjectIdFromUrl, replaceCleanProjectUrl } from "../../contexts/ProjectsContext/projectUrl";
import { PROJECTS } from "../../data/projects";
import type { Project } from "../../data/projects.types";
import { loadProjects } from "../../services/projectService";

const ProjectsBootstrapController = () => {
	const { projects, selectedProjectId } = useProjects();
	const { setProjects, setSavedProjects, setSelectedProjectId } = useProjectsActions();
	const { setActiveStatuses, setSearchTerm } = useSearchFiltersActions();
	const { setCreateDraft, setCreateSaveStatus } = useProjectEditingActions();
	const { clearProjectFocus, requestProjectFocus } = useMapActions();
	const { switchToViewState } = useAppStateActions();

	useEffect(() => {
		const applyLoadedProjects = (projectData: Project[]) => {
			const urlProjectId = getProjectIdFromUrl();
			const urlProject = findProjectById(projectData, urlProjectId);

			setProjects(projectData);
			setSavedProjects(projectData);

			if (urlProject) {
				setSearchTerm("");
				setActiveStatuses(current =>
					current.includes(urlProject.status) ? current : [...current, urlProject.status],
				);
				setSelectedProjectId(urlProject.id);
				requestProjectFocus(urlProject.id);
				return;
			}

			if (urlProjectId) {
				replaceCleanProjectUrl();
			}

			setSelectedProjectId(current => (projectData.some(project => project.id === current) ? current : ""));
		};

		loadProjects()
			.then(projectData => applyLoadedProjects(projectData))
			.catch(() => applyLoadedProjects(PROJECTS));
	}, [requestProjectFocus, setActiveStatuses, setProjects, setSavedProjects, setSearchTerm, setSelectedProjectId]);

	useEffect(() => {
		const handlePopState = () => {
			const urlProjectId = getProjectIdFromUrl();

			if (!urlProjectId) {
				setSelectedProjectId("");
				switchToViewState();
				setCreateDraft(null);
				setCreateSaveStatus("idle");
				clearProjectFocus();
				return;
			}

			const urlProject = findProjectById(projects, urlProjectId);

			if (!urlProject) {
				replaceCleanProjectUrl();
				setSelectedProjectId("");
				switchToViewState();
				clearProjectFocus();
				return;
			}

			setSearchTerm("");
			setActiveStatuses(current =>
				current.includes(urlProject.status) ? current : [...current, urlProject.status],
			);
			setSelectedProjectId(urlProject.id);
			switchToViewState();
			setCreateDraft(null);
			setCreateSaveStatus("idle");
		};

		window.addEventListener("popstate", handlePopState);

		return () => {
			window.removeEventListener("popstate", handlePopState);
		};
	}, [
		clearProjectFocus,
		projects,
		setActiveStatuses,
		setCreateDraft,
		setCreateSaveStatus,
		setSearchTerm,
		setSelectedProjectId,
		switchToViewState,
	]);

	useEffect(() => {
		if (!selectedProjectId || projects.some(project => project.id === selectedProjectId)) {
			return;
		}

		setSelectedProjectId("");
	}, [projects, selectedProjectId, setSelectedProjectId]);

	return null;
};

export default ProjectsBootstrapController;
