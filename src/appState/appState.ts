import type { AppState } from "./appState.types";

export const APP_STATES = {
	VIEW: "view",
	EDIT: "edit",
	CREATE: "create",
} as const satisfies Record<string, AppState>;
