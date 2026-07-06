import { ListFilter, Plus, Search } from "lucide-react";
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
			<label className="search-field">
				<Search size={17} aria-hidden="true" />
				<input
					type="search"
					value={searchTerm}
					placeholder="Search city projects"
					onChange={event => onSearchChange(event.target.value)}
				/>
			</label>
			{canEdit ? (
				<button
					className={`filter-icon-button create-project-button${isCreateMode ? " is-active" : ""}`}
					type="button"
					aria-label="Create project"
					aria-pressed={isCreateMode}
					title="Create project"
					onClick={onCreateProject}
				>
					<Plus size={20} aria-hidden="true" />
				</button>
			) : null}
			<button
				className={`filter-icon-button${showStatusFilters ? " is-active" : ""}`}
				type="button"
				aria-label={showStatusFilters ? "Hide status filters" : "Show status filters"}
				aria-expanded={showStatusFilters}
				onClick={onStatusFiltersToggle}
			>
				<ListFilter size={19} aria-hidden="true" />
			</button>
		</div>
	);
};

export default SearchControls;
