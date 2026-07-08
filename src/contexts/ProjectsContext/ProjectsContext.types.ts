import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { Project } from "../../data/projects.types";

export interface ProjectsContextValue {
	projects: Project[];
	savedProjects: Project[];
	selectedProjectId: string;
	filteredProjects: Project[];
	selectedProject?: Project;
}

export interface ProjectsActionsContextValue {
	setProjects: Dispatch<SetStateAction<Project[]>>;
	setSavedProjects: Dispatch<SetStateAction<Project[]>>;
	setSelectedProjectId: Dispatch<SetStateAction<string>>;
	clearSelectedProject: () => void;
}

export interface ProjectsProviderProps {
	children: ReactNode;
}
