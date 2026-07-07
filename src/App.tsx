import "./App.css";
import { MapController, SideController } from "./components";
import { ConfirmModalProvider, ProjectsProvider } from "./contexts";

const App = () => {
	return (
		<ConfirmModalProvider>
			<ProjectsProvider>
				<main className="app-shell">
					<MapController />
					<SideController />
				</main>
			</ProjectsProvider>
		</ConfirmModalProvider>
	);
};

export default App;
