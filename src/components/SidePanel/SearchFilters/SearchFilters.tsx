import { useProjectSearchFilters } from "../../../contexts";
import "./SearchFilters.css";

const SearchFilters = () => {
	const { statuses, activeStatuses, onStatusToggle } = useProjectSearchFilters();

	return (
		<section className="search-filters-row" aria-label="Search filters">
			{statuses.map(status => {
				const isActive = activeStatuses.includes(status);

				return (
					<button
						key={status}
						className={`search-filter-chip${isActive ? " is-active" : ""}`}
						type="button"
						aria-pressed={isActive}
						onClick={() => onStatusToggle(status)}
					>
						<span />
						{status}
					</button>
				);
			})}
		</section>
	);
};

export default SearchFilters;
