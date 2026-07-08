import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { ProjectStatus } from "../../data/projects.types";

export interface SearchFiltersContextValue {
	searchTerm: string;
	activeStatuses: ProjectStatus[];
	statuses: ProjectStatus[];
}

export interface SearchFiltersActionsContextValue {
	setSearchTerm: Dispatch<SetStateAction<string>>;
	setActiveStatuses: Dispatch<SetStateAction<ProjectStatus[]>>;
	toggleStatus: (status: ProjectStatus) => void;
}

export interface SearchFiltersProviderProps {
	children: ReactNode;
}
