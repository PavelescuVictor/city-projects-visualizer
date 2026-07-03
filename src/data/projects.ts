import type { DevelopmentProject, ProjectStatus, StatusMeta } from "../types/project";
import projectsData from "./projects.json";

export const statusMeta: Record<ProjectStatus, StatusMeta> = {
  planning: {
    label: "Planning",
    color: "#2563eb",
    fill: "#93c5fd",
  },
  permitting: {
    label: "Permitting",
    color: "#9a3412",
    fill: "#fdba74",
  },
  construction: {
    label: "Construction",
    color: "#047857",
    fill: "#86efac",
  },
  delivered: {
    label: "Delivered",
    color: "#52525b",
    fill: "#d4d4d8",
  },
};

export const projects = projectsData as unknown as DevelopmentProject[];
