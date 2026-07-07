import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { AppState, AppStateContextValue, AppStateProviderProps } from "./AppStateContext.types";

const APP_STATES = {
	VIEW: "view",
	EDIT: "edit",
	CREATE: "create",
} as const satisfies Record<string, AppState>;

const EDIT_PERMITTED = import.meta.env.DEV;

const AppStateContext = createContext<AppStateContextValue | null>(null);

const AppStateProvider = (props: AppStateProviderProps) => {
	const { children } = props;
	const [appState, setAppState] = useState<AppState>(APP_STATES.VIEW);

	const switchToViewState = useCallback(() => {
		setAppState(APP_STATES.VIEW);
	}, []);

	const switchToEditState = useCallback(() => {
		if (!EDIT_PERMITTED) {
			setAppState(APP_STATES.VIEW);
			return;
		}

		setAppState(APP_STATES.EDIT);
	}, []);

	const switchToCreateState = useCallback(() => {
		if (!EDIT_PERMITTED) {
			setAppState(APP_STATES.VIEW);
			return;
		}

		setAppState(APP_STATES.CREATE);
	}, []);

	const value = useMemo<AppStateContextValue>(
		() => ({
			appState,
			editPermitted: EDIT_PERMITTED,
			inViewMode: appState === APP_STATES.VIEW,
			inEditMode: appState === APP_STATES.EDIT,
			inCreateMode: appState === APP_STATES.CREATE,
			switchToViewState,
			switchToEditState,
			switchToCreateState,
		}),
		[appState, switchToCreateState, switchToEditState, switchToViewState],
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
