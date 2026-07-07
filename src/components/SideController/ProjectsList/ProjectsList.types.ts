import type { Project } from "../../../data/projects.types";

export interface ProjectsListProps {
	projects: Project[];
	selectedProject?: Project;
	onProjectSelect: (project: Project) => void;
}
