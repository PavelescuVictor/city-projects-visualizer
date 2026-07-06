import "./Button.css";
import type { ButtonProps } from "./Button.types";

const Button = (props: ButtonProps) => {
	const {
		children,
		className = "",
		isActive = false,
		type = "button",
		title,
		"aria-label": ariaLabel,
		"aria-expanded": ariaExpanded,
		"aria-pressed": ariaPressed,
		disabled,
		onClick,
	} = props;
	const classNames = ["basic-button", className, isActive ? "is-active" : ""].filter(Boolean).join(" ");

	return (
		<button
			className={classNames}
			type={type}
			title={title}
			aria-label={ariaLabel}
			aria-expanded={ariaExpanded}
			aria-pressed={ariaPressed}
			disabled={disabled}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default Button;
