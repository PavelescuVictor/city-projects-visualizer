import { createContext, useContext, useMemo, useState } from "react";
import { PROJECTS } from "../../data/projects";
import { useEditPermitted } from "../AppStateContext";
import { useSearchFilters } from "../SearchFiltersContext";
import { filterProjects } from "./ProjectsContext.helpers";
import type { ProjectsActionsContextValue, ProjectsContextValue, ProjectsProviderProps } from "./ProjectsContext.types";

const ProjectsContext = createContext<ProjectsContextValue | null>(null);
const ProjectsActionsContext = createContext<ProjectsActionsContextValue | null>(null);

const ProjectsProvider = (props: ProjectsProviderProps) => {
	const { children } = props;
	const editPermitted = useEditPermitted();
	const [projects, setProjects] = useState(editPermitted ? [] : PROJECTS);
	const [savedProjects, setSavedProjects] = useState(editPermitted ? [] : PROJECTS);
	const [selectedProjectId, setSelectedProjectId] = useState("");
	const { activeStatuses, searchTerm } = useSearchFilters();

	const filteredProjects = useMemo(
		() => filterProjects(projects, activeStatuses, searchTerm),
		[activeStatuses, projects, searchTerm],
	);
	const selectedProject = projects.find(project => project.id === selectedProjectId);

	const value = useMemo<ProjectsContextValue>(
		() => ({
			projects,
			savedProjects,
			selectedProjectId,
			filteredProjects,
			selectedProject,
		}),
		[filteredProjects, projects, savedProjects, selectedProject, selectedProjectId],
	);

	const actions = useMemo<ProjectsActionsContextValue>(
		() => ({
			setProjects,
			setSavedProjects,
			setSelectedProjectId,
			clearSelectedProject: () => setSelectedProjectId(""),
		}),
		[],
	);

	return (
		<ProjectsActionsContext.Provider value={actions}>
			<ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
		</ProjectsActionsContext.Provider>
	);
};

const useProjects = () => {
	const context = useContext(ProjectsContext);

	if (!context) {
		throw new Error("useProjects must be used within ProjectsProvider");
	}

	return context;
};

const useProjectsActions = () => {
	const context = useContext(ProjectsActionsContext);

	if (!context) {
		throw new Error("useProjectsActions must be used within ProjectsProvider");
	}

	return context;
};

export { ProjectsProvider, useProjects, useProjectsActions };
export default ProjectsProvider;
