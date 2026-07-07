import { ListFilter, Plus } from "lucide-react";
import { useState } from "react";
import { useAppState, useProjectEditing, useProjectSearchFilters } from "../../../contexts";
import { Button } from "../../basic";
import { SearchFilters } from "../SearchFilters";
import { SearchField } from "./SearchField";
import "./SearchController.css";

const SearchController = () => {
	const { searchTerm, onSearchChange } = useProjectSearchFilters();
	const { onCreateProject } = useProjectEditing();
	const { editPermitted, inCreateMode } = useAppState();
	const [showSearchFilters, setShowSearchFilters] = useState(false);

	const handleSearchFiltersToggle = () => {
		setShowSearchFilters(current => !current);
	};

	return (
		<>
			<div className="search-row">
				<SearchField value={searchTerm} placeholder="Search city projects" onChange={onSearchChange} />
				{editPermitted ? (
					<Button
						className="create-project-button"
						isActive={inCreateMode}
						aria-label="Create project"
						aria-pressed={inCreateMode}
						title="Create project"
						onClick={onCreateProject}
					>
						<Plus size={20} aria-hidden="true" />
					</Button>
				) : null}
				<Button
					isActive={showSearchFilters}
					aria-label={showSearchFilters ? "Hide search filters" : "Show search filters"}
					aria-expanded={showSearchFilters}
					title={showSearchFilters ? "Hide search filters" : "Show search filters"}
					onClick={handleSearchFiltersToggle}
				>
					<ListFilter size={19} aria-hidden="true" />
				</Button>
			</div>
			{showSearchFilters ? (
				<section className="filters" aria-label="Search filters">
					<SearchFilters />
				</section>
			) : null}
		</>
	);
};

export default SearchController;
