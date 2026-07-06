import type { ProjectStatus } from "../../data/projects.types";

export interface ProjectFiltersProps {
  statuses: ProjectStatus[];
  activeStatuses: ProjectStatus[];
  onStatusToggle: (status: ProjectStatus) => void;
}
