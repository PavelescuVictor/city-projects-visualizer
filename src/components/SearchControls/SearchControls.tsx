import { ListFilter, Plus } from "lucide-react";
import { Button } from "../basic";
import { SearchField } from "./SearchField";
import "./SearchControls.css";
import type { SearchControlsProps } from "./SearchControls.types";

const SearchControls = (props: SearchControlsProps) => {
	const {
		searchTerm,
		isCreateMode,
		canEdit,
		showStatusFilters,
		onSearchChange,
		onCreateProject,
		onStatusFiltersToggle,
	} = props;

	return (
		<div className={`search-row${canEdit ? " can-edit" : ""}`}>
			<SearchField value={searchTerm} placeholder="Search city projects" onChange={onSearchChange} />
			{canEdit ? (
				<Button
					className="create-project-button"
					isActive={isCreateMode}
					aria-label="Create project"
					aria-pressed={isCreateMode}
					title="Create project"
					onClick={onCreateProject}
				>
					<Plus size={20} aria-hidden="true" />
				</Button>
			) : null}
			<Button
				isActive={showStatusFilters}
				aria-label={showStatusFilters ? "Hide status filters" : "Show status filters"}
				aria-expanded={showStatusFilters}
				onClick={onStatusFiltersToggle}
			>
				<ListFilter size={19} aria-hidden="true" />
			</Button>
		</div>
	);
};

export default SearchControls;
