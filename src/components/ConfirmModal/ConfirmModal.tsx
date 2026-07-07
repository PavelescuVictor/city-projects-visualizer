import "./ConfirmModal.css";
import type { ConfirmModalProps } from "./ConfirmModal.types";

const ConfirmModal = (props: ConfirmModalProps) => {
	const { title, message, confirmLabel, cancelLabel, variant = "default", onCancel, onConfirm } = props;

	return (
		<div className="modal-backdrop" role="presentation">
			<div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
				<h3 id="confirm-modal-title">{title}</h3>
				<p>{message}</p>
				<div className="modal-actions">
					<button className="modal-secondary-button" type="button" onClick={onCancel}>
						{cancelLabel}
					</button>
					<button className={`modal-confirm-button is-${variant}`} type="button" onClick={onConfirm}>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmModal;
