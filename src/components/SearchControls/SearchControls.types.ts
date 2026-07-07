export interface SearchControlsProps {
	searchTerm: string;
	showStatusFilters: boolean;
	onSearchChange: (value: string) => void;
	onCreateProject: () => void;
	onStatusFiltersToggle: () => void;
}
