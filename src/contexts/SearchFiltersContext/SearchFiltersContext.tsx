import { createContext, useContext, useMemo, useState } from "react";
import { PROJECT_STATUSES } from "../../data/projects";
import type { ProjectStatus } from "../../data/projects.types";
import type {
	SearchFiltersActionsContextValue,
	SearchFiltersContextValue,
	SearchFiltersProviderProps,
} from "./SearchFiltersContext.types";

const ALL_STATUSES = Object.values(PROJECT_STATUSES);

const SearchFiltersContext = createContext<SearchFiltersContextValue | null>(null);
const SearchFiltersActionsContext = createContext<SearchFiltersActionsContextValue | null>(null);

const SearchFiltersProvider = (props: SearchFiltersProviderProps) => {
	const { children } = props;
	const [activeStatuses, setActiveStatuses] = useState<ProjectStatus[]>(ALL_STATUSES);
	const [searchTerm, setSearchTerm] = useState("");

	const value = useMemo<SearchFiltersContextValue>(
		() => ({
			searchTerm,
			activeStatuses,
			statuses: ALL_STATUSES,
		}),
		[activeStatuses, searchTerm],
	);

	const actions = useMemo<SearchFiltersActionsContextValue>(
		() => ({
			setSearchTerm,
			setActiveStatuses,
			toggleStatus: status => {
				setActiveStatuses(current => {
					if (current.includes(status)) {
						return current.filter(item => item !== status);
					}

					return [...current, status];
				});
			},
		}),
		[],
	);

	return (
		<SearchFiltersActionsContext.Provider value={actions}>
			<SearchFiltersContext.Provider value={value}>{children}</SearchFiltersContext.Provider>
		</SearchFiltersActionsContext.Provider>
	);
};

const useSearchFilters = () => {
	const context = useContext(SearchFiltersContext);

	if (!context) {
		throw new Error("useSearchFilters must be used within SearchFiltersProvider");
	}

	return context;
};

const useSearchFiltersActions = () => {
	const context = useContext(SearchFiltersActionsContext);

	if (!context) {
		throw new Error("useSearchFiltersActions must be used within SearchFiltersProvider");
	}

	return context;
};

export { SearchFiltersProvider, useSearchFilters, useSearchFiltersActions };
export default SearchFiltersProvider;
