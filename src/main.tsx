import React from "react";
import ReactDOM from "react-dom/client";
import "leaflet/dist/leaflet.css";
import "./styles/reset.css";
import "./styles/global.css";
import App from "./App";
import { AppStateProvider } from "./contexts";

const EDIT_PERMITTED = import.meta.env.DEV;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<AppStateProvider editPermitted={EDIT_PERMITTED}>
			<App />
		</AppStateProvider>
	</React.StrictMode>,
);
