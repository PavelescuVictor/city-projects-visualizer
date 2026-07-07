import { ProjectDetailsPanel } from "./ProjectDetailsPanel";
import { ProjectsList } from "./ProjectsList";
import { SearchController } from "./SearchController";
import "./SidePanel.css";

const SidePanel = () => {
	return (
		<aside className="control-panel" aria-label="Project controls">
			<SearchController />
			<ProjectDetailsPanel />
			<ProjectsList />
		</aside>
	);
};

export default SidePanel;
