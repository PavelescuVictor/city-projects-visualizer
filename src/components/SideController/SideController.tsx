import { useState } from "react";
import { useProjectData, useProjectEditing, useProjectFilters, useProjectMapState } from "../../contexts";
import { ProjectDetailsPanel } from "./ProjectDetailsPanel";
import { ProjectFilters } from "./ProjectFilters";
import { ProjectsList } from "./ProjectsList";
import { SearchControls } from "./SearchControls";
import "./SideController.css";
import type { SideControllerProps } from "./SideController.types";

const SideController = (_props: SideControllerProps) => {
	const { filteredProjects, selectedProject, focusedProjectId } = useProjectData();
	const { activeStatuses, searchTerm, statuses, onSearchChange, onStatusToggle } = useProjectFilters();
	const {
		createDraft,
		createSaveStatus,
		hasUnsavedChanges,
		saveStatus,
		onCreateDraftChange,
		onCreateProject,
		onCreateSave,
		onCreateCancel,
		onProjectEdit,
		onProjectDeleteRequest,
		onSaveProjects,
		onRevertProjects,
	} = useProjectEditing();
	const { onProjectFocus, onProjectToggleFocus } = useProjectMapState();
	const [showStatusFilters, setShowStatusFilters] = useState(false);

	return (
		<aside className="control-panel" aria-label="Project controls">
			<section className="filters" aria-label="Map filters">
				<SearchControls
					searchTerm={searchTerm}
					showStatusFilters={showStatusFilters}
					onSearchChange={onSearchChange}
					onCreateProject={onCreateProject}
					onStatusFiltersToggle={() => setShowStatusFilters(current => !current)}
				/>
				{showStatusFilters ? (
					<ProjectFilters
						statuses={statuses}
						activeStatuses={activeStatuses}
						onStatusToggle={onStatusToggle}
					/>
				) : null}
			</section>
			<ProjectDetailsPanel
				selectedProject={selectedProject}
				focusedProjectId={focusedProjectId}
				createDraft={createDraft}
				createSaveStatus={createSaveStatus}
				onProjectFocus={onProjectFocus}
				hasUnsavedChanges={hasUnsavedChanges}
				saveStatus={saveStatus}
				onCreateDraftChange={onCreateDraftChange}
				onCreateSave={onCreateSave}
				onCreateCancel={onCreateCancel}
				onProjectEdit={onProjectEdit}
				onProjectDeleteRequest={onProjectDeleteRequest}
				onSaveProjects={onSaveProjects}
				onRevertProjects={onRevertProjects}
			/>
			<ProjectsList
				projects={filteredProjects}
				selectedProject={selectedProject}
				onProjectSelect={onProjectToggleFocus}
			/>
		</aside>
	);
};

export default SideController;
