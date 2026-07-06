import type { ProjectStatus } from "../../data/projects.types";

export interface ProjectFiltersProps {
  statuses: ProjectStatus[];
  activeStatuses: ProjectStatus[];
  searchTerm: string;
  isCreateMode: boolean;
  canEdit: boolean;
  onSearchChange: (value: string) => void;
  onCreateProject: () => void;
  onStatusToggle: (status: ProjectStatus) => void;
}
