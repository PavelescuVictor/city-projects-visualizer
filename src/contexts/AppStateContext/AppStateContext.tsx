import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { AppState, AppStateContextValue, AppStateProviderProps } from "./AppStateContext.types";

const APP_STATES = {
	VIEW: "view",
	EDIT: "edit",
	CREATE: "create",
} as const satisfies Record<string, AppState>;

const AppStateContext = createContext<AppStateContextValue | null>(null);

const AppStateProvider = (props: AppStateProviderProps) => {
	const { children, editPermitted } = props;
	const [appState, setAppState] = useState<AppState>(APP_STATES.VIEW);

	const switchToViewState = useCallback(() => {
		setAppState(APP_STATES.VIEW);
	}, []);

	const switchToEditState = useCallback(() => {
		if (!editPermitted) {
			setAppState(APP_STATES.VIEW);
			return;
		}

		setAppState(APP_STATES.EDIT);
	}, [editPermitted]);

	const switchToCreateState = useCallback(() => {
		if (!editPermitted) {
			setAppState(APP_STATES.VIEW);
			return;
		}

		setAppState(APP_STATES.CREATE);
	}, [editPermitted]);

	const value = useMemo<AppStateContextValue>(
		() => ({
			appState,
			editPermitted,
			inViewMode: appState === APP_STATES.VIEW,
			inEditMode: appState === APP_STATES.EDIT,
			inCreateMode: appState === APP_STATES.CREATE,
			switchToViewState,
			switchToEditState,
			switchToCreateState,
		}),
		[appState, editPermitted, switchToCreateState, switchToEditState, switchToViewState],
	);

	return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

const useAppState = () => {
	const context = useContext(AppStateContext);

	if (!context) {
		throw new Error("useAppState must be used within AppStateProvider");
	}

	return context;
};

export { APP_STATES, AppStateProvider, useAppState };
export default AppStateProvider;
