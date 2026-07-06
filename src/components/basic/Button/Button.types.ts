import type { MouseEventHandler, ReactNode } from "react";

export interface ButtonProps {
	children: ReactNode;
	className?: string;
	isActive?: boolean;
	type?: "button" | "submit" | "reset";
	title?: string;
	"aria-label"?: string;
	"aria-expanded"?: boolean;
	"aria-pressed"?: boolean;
	disabled?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement>;
}
