import { RotateCcwSquare, Save } from "lucide-react";
import type { ChangeEvent } from "react";
import "./CreateProjectPanel.css";
import { useProjectEditing } from "../../../contexts";
import { PROJECT_STATUSES } from "../../../data/projects";
import type { CreateProjectDraft } from "../../../data/projects.types";
import { useCreateProjectController } from "./useCreateProjectController";

const CreateProjectPanel = () => {
	const { createDraft, createSaveStatus } = useProjectEditing();
	const { onCreateDraftChange, onCreateSave, onCreateCancel } = useCreateProjectController();
	const isReady = Boolean(
		createDraft?.name.trim() &&
			createDraft.address.trim() &&
			createDraft.neighbourhood.trim() &&
			createDraft.websiteUrl.trim(),
	);

	function updateField(field: keyof Pick<CreateProjectDraft, "name" | "address" | "neighbourhood" | "websiteUrl">) {
		return (event: ChangeEvent<HTMLInputElement>) => {
			if (!createDraft) {
				return;
			}

			onCreateDraftChange({
				...createDraft,
				[field]: event.target.value,
			});
		};
	}

	return (
		<div className="selected-project create-project-panel">
			<div className="create-project-heading">
				<span className="status-label">{PROJECT_STATUSES.PLANNING}</span>
				<h2>New project</h2>
			</div>

			<div className="create-project-fields">
				<label>
					<span>Title</span>
					<input type="text" value={createDraft?.name ?? ""} onChange={updateField("name")} />
				</label>
				<label>
					<span>Neighbourhood</span>
					<input
						type="text"
						value={createDraft?.neighbourhood ?? ""}
						onChange={updateField("neighbourhood")}
					/>
				</label>
				<label>
					<span>Address</span>
					<input type="text" value={createDraft?.address ?? ""} onChange={updateField("address")} />
				</label>
				<label>
					<span>Project website</span>
					<input type="url" value={createDraft?.websiteUrl ?? ""} onChange={updateField("websiteUrl")} />
				</label>
			</div>

			<div className="save-row">
				<button
					className="save-button"
					type="button"
					disabled={!isReady || createSaveStatus === "saving"}
					onClick={onCreateSave}
				>
					<Save size={17} aria-hidden="true" />
					{createSaveStatus === "saving" ? "Saving" : "Save changes"}
				</button>
				<button
					className="revert-button"
					type="button"
					aria-label="Cancel new project"
					title="Cancel"
					onClick={onCreateCancel}
				>
					<RotateCcwSquare size={19} aria-hidden="true" />
				</button>
			</div>
		</div>
	);
};

export default CreateProjectPanel;
