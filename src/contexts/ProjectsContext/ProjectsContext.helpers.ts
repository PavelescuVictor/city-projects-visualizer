import type { Project, ProjectStatus } from "../../data/projects.types";

function filterProjects(projects: Project[], activeStatuses: ProjectStatus[], searchTerm: string) {
	const normalizedSearch = searchTerm.trim().toLowerCase();

	return projects.filter(project => {
		const matchesStatus = activeStatuses.includes(project.status);
		const matchesSearch =
			normalizedSearch.length === 0 ||
			[project.name, project.type, project.address, project.neighbourhood]
				.filter(Boolean)
				.some(value => value?.toLowerCase().includes(normalizedSearch));

		return matchesStatus && matchesSearch;
	});
}

function normalizeWebsiteUrl(value: string) {
	const trimmedValue = value.trim();

	if (!trimmedValue || /^https?:\/\//i.test(trimmedValue)) {
		return trimmedValue;
	}

	return `https://${trimmedValue}`;
}

function slugify(value: string) {
	return (
		value
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "") || "new-project"
	);
}

function createProjectId(name: string, projects: Project[]) {
	const baseId = slugify(name);
	const usedIds = new Set(projects.map(project => project.id));
	let candidateId = baseId;
	let index = 2;

	while (usedIds.has(candidateId)) {
		candidateId = `${baseId}-${index}`;
		index += 1;
	}

	return candidateId;
}

function findProjectById(projects: Project[], projectId: string) {
	return projects.find(project => project.id === projectId);
}

export { createProjectId, filterProjects, findProjectById, normalizeWebsiteUrl };
