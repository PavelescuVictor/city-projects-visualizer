import { ExternalLink, MapPinned, Pencil, Trash2 } from "lucide-react";
import "./ProjectDetailsPanel.css";
import { useEditPermitted, useProjectData, useProjectEditing, useProjectMapState } from "../../../contexts";
import { ImageCarousel } from "../../basic";
import { ProjectMeta } from "./ProjectMeta";

const ProjectDetailsPanel = () => {
	const { focusedProjectId, selectedProject } = useProjectData();
	const { onProjectEdit, onProjectDeleteRequest } = useProjectEditing();
	const { onProjectFocus } = useProjectMapState();
	const editPermitted = useEditPermitted();

	if (!selectedProject) {
		return null;
	}

	const handleProjectDeleteRequest = () => {
		if (!selectedProject) {
			return;
		}

		onProjectDeleteRequest(selectedProject);
	};

	return (
		<section className="details-panel" aria-label="Project details">
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
						{editPermitted ? (
							<>
								<button
									className="project-title-edit-button"
									type="button"
									aria-label="Edit project geometry"
									title="Edit project geometry"
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
				<ProjectMeta project={selectedProject} />
				<a className="project-link" href={selectedProject.websiteUrl} target="_blank" rel="noreferrer">
					<ExternalLink size={17} aria-hidden="true" />
					Project website
				</a>
			</div>
		</section>
	);
};

export default ProjectDetailsPanel;
