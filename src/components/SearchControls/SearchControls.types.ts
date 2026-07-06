export interface SearchControlsProps {
	searchTerm: string;
	isCreateMode: boolean;
	canEdit: boolean;
	showStatusFilters: boolean;
	onSearchChange: (value: string) => void;
	onCreateProject: () => void;
	onStatusFiltersToggle: () => void;
}
