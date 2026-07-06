import { ExternalLink, MapPinned, Pencil, RotateCcwSquare, Save, Trash2 } from "lucide-react";
import "./ProjectDetailsPanel.css";
import { CreateProjectPanel } from "../CreateProjectPanel";
import { useDeleteConfirmModal } from "../DeleteConfirmModal";
import { ImageCarousel } from "../ImageCarousel";
import type { ProjectDetailsPanelProps } from "./ProjectDetailsPanel.types";

const ProjectDetailsPanel = (props: ProjectDetailsPanelProps) => {
	const {
		selectedProject,
		focusedProjectId,
		isCreateMode,
		createDraft,
		createSaveStatus,
		canEdit,
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
	} = props;
	const { confirmProjectDelete } = useDeleteConfirmModal();

	if (!isCreateMode && !selectedProject) {
		return null;
	}

	const handleProjectDeleteRequest = async () => {
		if (!selectedProject) {
			return;
		}

		const shouldDelete = await confirmProjectDelete(selectedProject);

		if (shouldDelete) {
			onProjectDeleteRequest(selectedProject);
		}
	};

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
							<span className="status-label">{selectedProject.status}</span>
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
										onClick={() => {
											void handleProjectDeleteRequest();
										}}
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
								<dd className="project-type-value">{selectedProject.type}</dd>
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
					<a className="project-link" href={selectedProject.websiteUrl} target="_blank" rel="noreferrer">
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
		</section>
	);
};

export { ProjectDetailsPanel };
