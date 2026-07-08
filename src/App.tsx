import "./App.css";
import { MapController, ProjectsBootstrapController, SidePanel } from "./components";
import {
	ConfirmModalProvider,
	MapProvider,
	ProjectEditingProvider,
	ProjectsProvider,
	SearchFiltersProvider,
} from "./contexts";

const App = () => {
	return (
		<ConfirmModalProvider>
			<SearchFiltersProvider>
				<ProjectsProvider>
					<ProjectEditingProvider>
						<MapProvider>
							<ProjectsBootstrapController />
							<main className="app-shell">
								<MapController />
								<SidePanel />
							</main>
						</MapProvider>
					</ProjectEditingProvider>
				</ProjectsProvider>
			</SearchFiltersProvider>
		</ConfirmModalProvider>
	);
};

export default App;
