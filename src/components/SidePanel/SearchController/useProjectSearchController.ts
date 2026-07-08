import { useCallback } from "react";
import { useSearchFilters, useSearchFiltersActions } from "../../../contexts";
import type { ProjectStatus } from "../../../data/projects.types";
import { useClearProjectSelection } from "../../../hooks/useProjectWorkflowHelpers";

function useProjectSearchController() {
	const searchFilters = useSearchFilters();
	const { setSearchTerm, toggleStatus } = useSearchFiltersActions();
	const clearProjectSelection = useClearProjectSelection();

	const onSearchChange = useCallback(
		(value: string) => {
			clearProjectSelection();
			setSearchTerm(value);
		},
		[clearProjectSelection, setSearchTerm],
	);

	const onStatusToggle = useCallback(
		(status: ProjectStatus) => {
			clearProjectSelection();
			toggleStatus(status);
		},
		[clearProjectSelection, toggleStatus],
	);

	return {
		...searchFilters,
		onSearchChange,
		onStatusToggle,
	};
}

export { useProjectSearchController };
