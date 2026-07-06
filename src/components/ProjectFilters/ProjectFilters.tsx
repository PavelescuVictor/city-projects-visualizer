import { useState } from "react";
import { ListFilter, Plus, Search } from "lucide-react";
import "./ProjectFilters.css";
import type { ProjectFiltersProps } from "./ProjectFilters.types";

export function ProjectFilters({
  statuses,
  activeStatuses,
  searchTerm,
  isCreateMode,
  canEdit,
  onSearchChange,
  onCreateProject,
  onStatusToggle,
}: ProjectFiltersProps) {
  const [showStatusFilters, setShowStatusFilters] = useState(false);

  return (
    <section className="filters" aria-label="Map filters">
      <div className={`search-row${canEdit ? " can-edit" : ""}`}>
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            value={searchTerm}
            placeholder="Search city projects"
            onChange={(event) => onSearchChange(event.target.value)}
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
          onClick={() => setShowStatusFilters((current) => !current)}
        >
          <ListFilter size={19} aria-hidden="true" />
        </button>
      </div>

      {showStatusFilters ? (
        <div className="status-row" aria-label="Status filters">
          {statuses.map((status) => {
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
        </div>
      ) : null}
    </section>
  );
}
