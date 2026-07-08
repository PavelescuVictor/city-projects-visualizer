import type { ReactNode } from "react";

export interface MapStateContextValue {
	focusedProjectId: string;
	focusProjectId: string;
	focusSignal: number;
	resetSignal: number;
}

export interface MapActionsContextValue {
	requestProjectFocus: (projectId: string) => void;
	clearProjectFocus: () => void;
	requestMapReset: () => void;
}

export interface MapProviderProps {
	children: ReactNode;
}
