import type { ReactNode } from "react";
import type { ConfirmModalVariant } from "../../components/ConfirmModal";

export interface ConfirmOptions {
	title: string;
	message: ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: ConfirmModalVariant;
}

export interface PendingConfirmation extends Required<ConfirmOptions> {
	resolve: (value: boolean) => void;
}

export interface ConfirmModalContextValue {
	confirm: (options: ConfirmOptions) => Promise<boolean>;
}

export interface ConfirmModalProviderProps {
	children: ReactNode;
}
