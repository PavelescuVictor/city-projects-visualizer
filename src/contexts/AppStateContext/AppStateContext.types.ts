import type { ReactNode } from "react";
import type { AppState } from "../../appState";

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
	editPermitted: boolean;
}
