import type { DevelopmentProject, ProjectStatus, ProjectType, ProjectTypeMeta, StatusMeta } from "../types/project";
import projectsData from "./projects.json";

export const statusMeta: Record<ProjectStatus, StatusMeta> = {
  planning: {
    label: "Planning",
  },
  permitting: {
    label: "Permitting",
  },
  construction: {
    label: "Construction",
  },
  delivered: {
    label: "Delivered",
  },
};

export const projectTypeMeta: Record<ProjectType, ProjectTypeMeta> = {
  building: {
    label: "Building",
    color: "#2563eb",
    fill: "#93c5fd",
  },
  park: {
    label: "Park",
    color: "#047857",
    fill: "#86efac",
  },
  "transport-infrastructure": {
    label: "Transport infrastructure",
    color: "#ea580c",
    fill: "#fdba74",
  },
  "public-space": {
    label: "Public space",
    color: "#7c3aed",
    fill: "#c4b5fd",
  },
};

export const projects = projectsData as unknown as DevelopmentProject[];
