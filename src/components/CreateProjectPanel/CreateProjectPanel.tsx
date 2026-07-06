import { RotateCcwSquare, Save } from "lucide-react";
import type { ChangeEvent } from "react";
import "./CreateProjectPanel.css";
import { PROJECT_STATUSES } from "../../data/projects";
import type { CreateProjectDraft } from "../../data/projects.types";
import type { CreateProjectPanelProps } from "./CreateProjectPanel.types";

const CreateProjectPanel = (props: CreateProjectPanelProps) => {
	const { draft, saveStatus, onDraftChange, onSave, onRevert } = props;
	const isReady = Boolean(
		draft?.name.trim() && draft.address.trim() && draft.neighbourhood.trim() && draft.websiteUrl.trim(),
	);

	function updateField(field: keyof Pick<CreateProjectDraft, "name" | "address" | "neighbourhood" | "websiteUrl">) {
		return (event: ChangeEvent<HTMLInputElement>) => {
			if (!draft) {
				return;
			}

			onDraftChange({
				...draft,
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
					<input type="text" value={draft?.name ?? ""} onChange={updateField("name")} />
				</label>
				<label>
					<span>Neighbourhood</span>
					<input type="text" value={draft?.neighbourhood ?? ""} onChange={updateField("neighbourhood")} />
				</label>
				<label>
					<span>Address</span>
					<input type="text" value={draft?.address ?? ""} onChange={updateField("address")} />
				</label>
				<label>
					<span>Project website</span>
					<input type="url" value={draft?.websiteUrl ?? ""} onChange={updateField("websiteUrl")} />
				</label>
			</div>

			<div className="save-row">
				<button
					className="save-button"
					type="button"
					disabled={!isReady || saveStatus === "saving"}
					onClick={onSave}
				>
					<Save size={17} aria-hidden="true" />
					{saveStatus === "saving" ? "Saving" : "Save changes"}
				</button>
				<button
					className="revert-button"
					type="button"
					aria-label="Cancel new project"
					title="Cancel"
					onClick={onRevert}
				>
					<RotateCcwSquare size={19} aria-hidden="true" />
				</button>
			</div>
		</div>
	);
};

export default CreateProjectPanel;
