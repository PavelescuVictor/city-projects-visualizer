import { RotateCcwSquare, Save } from "lucide-react";
import type { ChangeEvent } from "react";
import { useProjectData, useProjectEditing } from "../../../contexts";
import { PROJECT_STATUSES, PROJECT_TYPES } from "../../../data/projects";
import type { Project, ProjectStatus, ProjectType } from "../../../data/projects.types";
import "./EditProjectPanel.css";

const STATUS_OPTIONS = Object.values(PROJECT_STATUSES);
const TYPE_OPTIONS = Object.values(PROJECT_TYPES);

const EditProjectPanel = () => {
	const { selectedProject, hasUnsavedChanges, saveStatus } = useProjectData();
	const { onProjectChange, onSaveProjects, onRevertProjects } = useProjectEditing();

	if (!selectedProject) {
		return null;
	}

	const handleFieldChange = (field: keyof Pick<Project, "name" | "address" | "neighbourhood" | "websiteUrl">) => {
		return (event: ChangeEvent<HTMLInputElement>) => {
			onProjectChange({
				...selectedProject,
				[field]: event.target.value,
			});
		};
	};

	const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
		onProjectChange({
			...selectedProject,
			status: event.target.value as ProjectStatus,
		});
	};

	const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
		onProjectChange({
			...selectedProject,
			type: event.target.value as ProjectType,
		});
	};

	return (
		<div className="edit-project-panel">
			<div className="edit-project-fields">
				<label>
					<span>Title</span>
					<input type="text" value={selectedProject.name} onChange={handleFieldChange("name")} />
				</label>
				<div className="edit-project-fields-combined">
					<label>
						<span>Status</span>
						<select value={selectedProject.status} onChange={handleStatusChange}>
							{STATUS_OPTIONS.map(status => (
								<option key={status} value={status}>
									{status}
								</option>
							))}
						</select>
					</label>
					<label>
						<span>Type</span>
						<select value={selectedProject.type} onChange={handleTypeChange}>
							{TYPE_OPTIONS.map(type => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
					</label>
				</div>
				<label>
					<span>Neighbourhood</span>
					<input
						type="text"
						value={selectedProject.neighbourhood}
						onChange={handleFieldChange("neighbourhood")}
					/>
				</label>
				<label>
					<span>Address</span>
					<input type="text" value={selectedProject.address} onChange={handleFieldChange("address")} />
				</label>
				<label>
					<span>Project website</span>
					<input type="url" value={selectedProject.websiteUrl} onChange={handleFieldChange("websiteUrl")} />
				</label>
			</div>

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
		</div>
	);
};

export default EditProjectPanel;
