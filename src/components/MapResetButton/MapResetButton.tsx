import { RotateCcw } from "lucide-react";
import "./MapResetButton.css";
import type { MapResetButtonProps } from "./MapResetButton.types";

const MapResetButton = (props: MapResetButtonProps) => {
	const { onReset } = props;

	return (
		<button
			className="icon-button map-reset-button"
			type="button"
			aria-label="Reset map view"
			title="Reset map view"
			onClick={onReset}
		>
			<RotateCcw size={18} aria-hidden="true" />
		</button>
	);
};

export { MapResetButton };
