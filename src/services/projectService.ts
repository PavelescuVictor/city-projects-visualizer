import { projects as bundledProjects } from "../data/projects";
import type { Project } from "../data/projects.types";

const projectsApiPath = "/api/projects";

const validateProjectData = (value: unknown, errorMessage: string): Project[] => {
	if (!Array.isArray(value)) {
		throw new Error(errorMessage);
	}

	return value as Project[];
};

const loadProjects = async (): Promise<Project[]> => {
	if (!import.meta.env.DEV) {
		return bundledProjects;
	}

	const response = await fetch(projectsApiPath, {
		cache: "no-store",
	});

	if (!response.ok) {
		throw new Error("Project load failed");
	}

	return validateProjectData(await response.json(), "Invalid project data");
};

const saveProjects = async (projects: Project[]): Promise<Project[]> => {
	if (!import.meta.env.DEV) {
		throw new Error("Project saving is only available in local development");
	}

	const response = await fetch(projectsApiPath, {
		method: "POST",
		cache: "no-store",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(projects),
	});

	if (!response.ok) {
		throw new Error("Project save failed");
	}

	return validateProjectData(await response.json(), "Invalid saved project data");
};

export { loadProjects, saveProjects };
