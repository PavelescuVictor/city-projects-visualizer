import projectsData from "./projects.json";
import type { Project, ProjectStatus, ProjectType } from "./projects.types";

export const PROJECT_STATUSES = {
	PLANNING: "planning",
	PERMITTING: "permitting",
	CONSTRUCTION: "construction",
	DELIVERED: "delivered",
} as const satisfies Record<string, ProjectStatus>;

export const PROJECT_TYPES = {
	BUILDING: "building",
	PARK: "park",
	TRANSPORT_INFRASTRUCTURE: "transport-infrastructure",
	PUBLIC_SPACE: "public-space",
} as const satisfies Record<string, ProjectType>;

export const PROJECTS = projectsData as unknown as Project[];
