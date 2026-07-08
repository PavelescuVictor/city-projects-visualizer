import { createContext, useContext, useMemo, useState } from "react";
import type { MapActionsContextValue, MapProviderProps, MapStateContextValue } from "./MapContext.types";

const MapContext = createContext<MapStateContextValue | null>(null);
const MapActionsContext = createContext<MapActionsContextValue | null>(null);

const MapProvider = (props: MapProviderProps) => {
	const { children } = props;
	const [resetSignal, setResetSignal] = useState(0);
	const [focusRequest, setFocusRequest] = useState({
		projectId: "",
		requestId: 0,
	});

	const value = useMemo<MapStateContextValue>(
		() => ({
			focusedProjectId: focusRequest.projectId,
			focusProjectId: focusRequest.projectId,
			focusSignal: focusRequest.requestId,
			resetSignal,
		}),
		[focusRequest.projectId, focusRequest.requestId, resetSignal],
	);

	const actions = useMemo<MapActionsContextValue>(
		() => ({
			requestProjectFocus: projectId => {
				setFocusRequest(current => ({
					projectId,
					requestId: current.requestId + 1,
				}));
			},
			clearProjectFocus: () => {
				setFocusRequest(current => ({
					projectId: "",
					requestId: current.requestId,
				}));
			},
			requestMapReset: () => {
				setResetSignal(value => value + 1);
			},
		}),
		[],
	);

	return (
		<MapActionsContext.Provider value={actions}>
			<MapContext.Provider value={value}>{children}</MapContext.Provider>
		</MapActionsContext.Provider>
	);
};

const useMapState = () => {
	const context = useContext(MapContext);

	if (!context) {
		throw new Error("useMapState must be used within MapProvider");
	}

	return context;
};

const useMapActions = () => {
	const context = useContext(MapActionsContext);

	if (!context) {
		throw new Error("useMapActions must be used within MapProvider");
	}

	return context;
};

export { MapProvider, useMapActions, useMapState };
export default MapProvider;
