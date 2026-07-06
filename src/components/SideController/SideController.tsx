import { useState } from "react";
import { ProjectDetailsPanel } from "../ProjectDetailsPanel";
import { ProjectFilters } from "../ProjectFilters";
import { ProjectsList } from "../ProjectsList";
import { SearchControls } from "../SearchControls";
import "./SideController.css";
import type { SideControllerProps } from "./SideController.types";

const SideController = (props: SideControllerProps) => {
  const {
    projects,
    selectedProject,
    focusedProjectId,
    statuses,
    activeStatuses,
    searchTerm,
    isCreateMode,
    createDraft,
    createSaveStatus,
    canEdit,
    isEditMode,
    hasUnsavedChanges,
    saveStatus,
    onSearchChange,
    onCreateProject,
    onStatusToggle,
    onProjectSelect,
    onProjectFocus,
    onCreateDraftChange,
    onCreateSave,
    onCreateCancel,
    onProjectEdit,
    onProjectDeleteRequest,
    onSaveProjects,
    onRevertProjects,
  } = props;
  const [showStatusFilters, setShowStatusFilters] = useState(false);

  return (
    <aside className="control-panel" aria-label="Project controls">
      <section className="filters" aria-label="Map filters">
        <SearchControls
          searchTerm={searchTerm}
          isCreateMode={isCreateMode}
          canEdit={canEdit}
          showStatusFilters={showStatusFilters}
          onSearchChange={onSearchChange}
          onCreateProject={onCreateProject}
          onStatusFiltersToggle={() => setShowStatusFilters((current) => !current)}
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
        isCreateMode={isCreateMode}
        createDraft={createDraft}
        createSaveStatus={createSaveStatus}
        canEdit={canEdit}
        onProjectFocus={onProjectFocus}
        isEditMode={isEditMode}
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
        projects={projects}
        selectedProject={selectedProject}
        onProjectSelect={onProjectSelect}
      />
    </aside>
  );
};

export { SideController };
