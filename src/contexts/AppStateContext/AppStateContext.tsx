import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type {
	AppState,
	AppStateActionsContextValue,
	AppStateProviderProps,
	AppStateValueContextValue,
} from "./AppStateContext.types";

const APP_STATES = {
	VIEW: "view",
	EDIT: "edit",
	CREATE: "create",
} as const satisfies Record<string, AppState>;

const EDIT_PERMITTED = import.meta.env.DEV;

const AppStateValueContext = createContext<AppStateValueContextValue | null>(null);
const AppStateActionsContext = createContext<AppStateActionsContextValue | null>(null);

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

	const value = useMemo<AppStateValueContextValue>(
		() => ({
			appState,
			editPermitted: EDIT_PERMITTED,
			inViewMode: appState === APP_STATES.VIEW,
			inEditMode: appState === APP_STATES.EDIT,
			inCreateMode: appState === APP_STATES.CREATE,
		}),
		[appState],
	);

	const actions = useMemo<AppStateActionsContextValue>(
		() => ({
			switchToViewState,
			switchToEditState,
			switchToCreateState,
		}),
		[switchToCreateState, switchToEditState, switchToViewState],
	);

	return (
		<AppStateActionsContext.Provider value={actions}>
			<AppStateValueContext.Provider value={value}>{children}</AppStateValueContext.Provider>
		</AppStateActionsContext.Provider>
	);
};

const useAppState = () => {
	const context = useContext(AppStateValueContext);

	if (!context) {
		throw new Error("useAppState must be used within AppStateProvider");
	}

	return context;
};

const useAppStateActions = () => {
	const context = useContext(AppStateActionsContext);

	if (!context) {
		throw new Error("useAppStateActions must be used within AppStateProvider");
	}

	return context;
};

const useAppMode = () => {
	const { appState } = useAppState();

	return appState;
};

const useEditPermitted = () => {
	const { editPermitted } = useAppState();

	return editPermitted;
};

export { APP_STATES, AppStateProvider, useAppMode, useAppState, useAppStateActions, useEditPermitted };
export default AppStateProvider;
