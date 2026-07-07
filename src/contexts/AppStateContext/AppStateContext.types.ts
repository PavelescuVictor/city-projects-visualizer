import type { ReactNode } from "react";

export type AppState = "view" | "edit" | "create";

export interface AppStateContextValue {
	appState: AppState;
	editPermitted: boolean;
	inViewMode: boolean;
	inEditMode: boolean;
	inCreateMode: boolean;
	switchToViewState: () => void;
	switchToEditState: () => void;
	switchToCreateState: () => void;
}

export interface AppStateProviderProps {
	children: ReactNode;
}
