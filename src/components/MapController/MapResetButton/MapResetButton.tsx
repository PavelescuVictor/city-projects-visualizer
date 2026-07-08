import { RotateCcw } from "lucide-react";
import { Button } from "../../basic";
import { useProjectSelectionController } from "../../projectWorkflows";
import "./MapResetButton.css";

const MapResetButton = () => {
	const { onReset } = useProjectSelectionController();

	return (
		<Button
			className="icon-button map-reset-button"
			aria-label="Reset map view"
			title="Reset map view"
			onClick={onReset}
		>
			<RotateCcw size={18} aria-hidden="true" />
		</Button>
	);
};

export default MapResetButton;
