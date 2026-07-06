import { createContext, useCallback, useContext, useRef, useState } from "react";
import "./DeleteConfirmModal.css";
import type { Project } from "../../data/projects.types";
import type {
	DeleteConfirmModalContextValue,
	DeleteConfirmModalProps,
	DeleteConfirmModalProviderProps,
} from "./DeleteConfirmModal.types";

interface PendingDeleteConfirmation {
	project: Project;
	resolve: (value: boolean) => void;
}

const DeleteConfirmModalContext = createContext<DeleteConfirmModalContextValue | null>(null);

const DeleteConfirmModal = (props: DeleteConfirmModalProps) => {
	const { project, onCancel, onConfirm } = props;

	return (
		<div className="modal-backdrop" role="presentation">
			<div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="delete-project-title">
				<h3 id="delete-project-title">Delete project?</h3>
				<p>
					This removes <strong>{project.name}</strong> from the local project list.
				</p>
				<div className="modal-actions">
					<button className="modal-secondary-button" type="button" onClick={onCancel}>
						Cancel
					</button>
					<button className="modal-danger-button" type="button" onClick={onConfirm}>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

const DeleteConfirmModalProvider = (props: DeleteConfirmModalProviderProps) => {
	const { children } = props;
	const [pendingConfirmation, setPendingConfirmation] = useState<PendingDeleteConfirmation | null>(null);
	const pendingConfirmationRef = useRef<PendingDeleteConfirmation | null>(null);

	const closePendingConfirmation = useCallback((value: boolean) => {
		pendingConfirmationRef.current?.resolve(value);
		pendingConfirmationRef.current = null;
		setPendingConfirmation(null);
	}, []);

	const confirmProjectDelete = useCallback((project: Project) => {
		pendingConfirmationRef.current?.resolve(false);

		return new Promise<boolean>(resolve => {
			const nextConfirmation = { project, resolve };

			pendingConfirmationRef.current = nextConfirmation;
			setPendingConfirmation(nextConfirmation);
		});
	}, []);

	return (
		<DeleteConfirmModalContext.Provider value={{ confirmProjectDelete }}>
			{children}
			{pendingConfirmation ? (
				<DeleteConfirmModal
					project={pendingConfirmation.project}
					onCancel={() => closePendingConfirmation(false)}
					onConfirm={() => closePendingConfirmation(true)}
				/>
			) : null}
		</DeleteConfirmModalContext.Provider>
	);
};

const useDeleteConfirmModal = () => {
	const context = useContext(DeleteConfirmModalContext);

	if (!context) {
		throw new Error("useDeleteConfirmModal must be used within DeleteConfirmModalProvider");
	}

	return context;
};

export { DeleteConfirmModal, DeleteConfirmModalProvider, useDeleteConfirmModal };
