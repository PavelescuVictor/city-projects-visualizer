import { ExternalLink, MapPinned, Pencil, RotateCcwSquare, Save, Trash2 } from "lucide-react";
import { CreateProjectPanel } from "./CreateProjectPanel";
import { ImageCarousel } from "./ImageCarousel";
import { statusMeta } from "../data/projects";
import type { CreateProjectDraft, DevelopmentProject } from "../types/project";

interface ProjectDetailsPanelProps {
  projects: DevelopmentProject[];
  selectedProject?: DevelopmentProject;
  focusedProjectId: string;
  isCreateMode: boolean;
  createDraft: CreateProjectDraft | null;
  createSaveStatus: "idle" | "saving" | "saved" | "error";
  canEdit: boolean;
  onProjectSelect: (project: DevelopmentProject) => void;
  onProjectFocus: (project: DevelopmentProject) => void;
  isEditMode: boolean;
  hasUnsavedChanges: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error";
  onCreateDraftChange: (draft: CreateProjectDraft) => void;
  onCreateSave: () => void;
  onCreateCancel: () => void;
  onProjectEdit: (project: DevelopmentProject) => void;
  onProjectDeleteRequest: (project: DevelopmentProject) => void;
  onSaveProjects: () => void;
  onRevertProjects: () => void;
}

const projectTypeLabels: Record<DevelopmentProject["type"], string> = {
  building: "Building",
  park: "Park",
  bridge: "Bridge",
  street: "Street",
  "public-space": "Public space",
};

export function ProjectDetailsPanel({
  projects,
  selectedProject,
  focusedProjectId,
  isCreateMode,
  createDraft,
  createSaveStatus,
  canEdit,
  onProjectSelect,
  onProjectFocus,
  isEditMode,
  hasUnsavedChanges,
  saveStatus,
  onCreateDraftChange,
  onCreateSave,
  onCreateCancel,
  onProjectEdit,
  onProjectDeleteRequest,
  onSaveProjects,
  onRevertProjects,
}: ProjectDetailsPanelProps) {
  return (
    <section className="details-panel" aria-label="Project details">
      {isCreateMode ? (
        <CreateProjectPanel
          draft={createDraft}
          saveStatus={createSaveStatus}
          onDraftChange={onCreateDraftChange}
          onSave={onCreateSave}
          onRevert={onCreateCancel}
        />
      ) : selectedProject ? (
        <div className="selected-project">
          <div className="project-title-row">
            <div>
              <span className="status-label" style={{ color: statusMeta[selectedProject.status].color }}>
                {statusMeta[selectedProject.status].label}
              </span>
              <h2>{selectedProject.name}</h2>
            </div>
            <div className="project-title-actions">
              <button
                className={`project-title-focus-button${selectedProject.id === focusedProjectId ? " is-active" : ""}`}
                type="button"
                aria-label="Focus project on map"
                title="Focus project on map"
                onClick={() => onProjectFocus(selectedProject)}
              >
                <MapPinned size={20} aria-hidden="true" />
              </button>
              {canEdit ? (
                <>
                  <button
                    className={`project-title-edit-button${isEditMode ? " is-active" : ""}`}
                    type="button"
                    aria-label="Edit project geometry"
                    title="Edit project geometry"
                    aria-pressed={isEditMode}
                    onClick={() => onProjectEdit(selectedProject)}
                  >
                    <Pencil size={18} aria-hidden="true" />
                  </button>
                  <button
                    className="project-title-delete-button"
                    type="button"
                    aria-label="Delete project"
                    title="Delete project"
                    onClick={() => onProjectDeleteRequest(selectedProject)}
                  >
                    <Trash2 size={19} aria-hidden="true" />
                  </button>
                </>
              ) : null}
            </div>
          </div>
          <ImageCarousel images={selectedProject.images} />
          <dl className="project-meta">
            <div className="project-meta-combined">
              <div>
                <dt>Type</dt>
                <dd>{projectTypeLabels[selectedProject.type]}</dd>
              </div>
              <div>
                <dt>Neighbourhood</dt>
                <dd>{selectedProject.neighbourhood}</dd>
              </div>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{selectedProject.address}</dd>
            </div>
          </dl>
          <a
            className="project-link"
            href={selectedProject.websiteUrl}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={17} aria-hidden="true" />
            Project website
          </a>
          {canEdit && isEditMode ? (
            <div className="save-row">
              <button
                className="save-button"
                type="button"
                disabled={!hasUnsavedChanges || saveStatus === "saving"}
                onClick={onSaveProjects}
              >
                <Save size={17} aria-hidden="true" />
                {saveStatus === "saving" ? "Saving" : "Save changes"}
              </button>
              <button
                className="revert-button"
                type="button"
                disabled={!hasUnsavedChanges || saveStatus === "saving"}
                aria-label="Revert changes"
                title="Revert changes"
                onClick={onRevertProjects}
              >
                <RotateCcwSquare size={19} aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="project-list-divider">
        <span>{projects.length} shown</span>
      </div>

      <div className="project-list" aria-label="Visible projects">
        {projects.map((project) => {
          const isSelected = project.id === selectedProject?.id;

          return (
            <button
              key={project.id}
              className={`project-row${isSelected ? " is-selected" : ""}`}
              data-project-id={project.id}
              type="button"
              onClick={() => onProjectSelect(project)}
            >
              <span className="project-row-dot" style={{ background: statusMeta[project.status].color }} />
              <span>
                <strong>{project.name}</strong>
                <small>{projectTypeLabels[project.type]} - {project.neighbourhood}</small>
              </span>
              <em>{statusMeta[project.status].label}</em>
            </button>
          );
        })}
      </div>
    </section>
  );
}
