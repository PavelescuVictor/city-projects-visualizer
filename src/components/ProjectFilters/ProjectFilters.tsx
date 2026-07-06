import "./ProjectFilters.css";
import type { ProjectFiltersProps } from "./ProjectFilters.types";

const ProjectFilters = (props: ProjectFiltersProps) => {
	const { statuses, activeStatuses, onStatusToggle } = props;

	return (
		<section className="status-row" aria-label="Status filters">
			{statuses.map(status => {
				const isActive = activeStatuses.includes(status);

				return (
					<button
						key={status}
						className={`status-chip${isActive ? " is-active" : ""}`}
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

export { ProjectFilters };
