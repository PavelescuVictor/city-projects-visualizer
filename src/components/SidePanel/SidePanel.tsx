import type { ReactNode } from "react";
import { APP_STATES, useAppMode, useProjectData } from "../../contexts";
import { CreateProjectPanel } from "./CreateProjectPanel";
import { EditProjectPanel } from "./EditProjectPanel";
import { ProjectDetailsPanel } from "./ProjectDetailsPanel";
import { ProjectsList } from "./ProjectsList";
import { SearchController } from "./SearchController";
import "./SidePanel.css";

const SidePanel = () => {
	const appState = useAppMode();
	const { selectedProject } = useProjectData();

	let panelContent: ReactNode = null;
	if (appState === APP_STATES.CREATE) {
		panelContent = <CreateProjectPanel />;
	} else if (appState === APP_STATES.EDIT && selectedProject) {
		panelContent = <EditProjectPanel />;
	} else if (appState === APP_STATES.VIEW && selectedProject) {
		panelContent = <ProjectDetailsPanel />;
	}

	return (
		<aside className="control-panel" aria-label="Project controls">
			<SearchController />
			{panelContent}
			<ProjectsList />
		</aside>
	);
};

export default SidePanel;
