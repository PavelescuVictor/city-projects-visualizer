import type { ReactNode } from "react";

export type ConfirmModalVariant = "default" | "danger";

export interface ConfirmModalProps {
	title: string;
	message: ReactNode;
	confirmLabel: string;
	cancelLabel: string;
	variant?: ConfirmModalVariant;
	onCancel: () => void;
	onConfirm: () => void;
}
