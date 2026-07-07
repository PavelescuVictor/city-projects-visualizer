import "./App.css";
import { MapController, SidePanel } from "./components";
import { ConfirmModalProvider, ProjectsProvider } from "./contexts";

const App = () => {
	return (
		<ConfirmModalProvider>
			<ProjectsProvider>
				<main className="app-shell">
					<MapController />
					<SidePanel />
				</main>
			</ProjectsProvider>
		</ConfirmModalProvider>
	);
};

export default App;
