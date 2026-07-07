import { createContext, useCallback, useContext, useRef, useState } from "react";
import { ConfirmModal } from "../../components/ConfirmModal";
import type {
	ConfirmModalContextValue,
	ConfirmModalProviderProps,
	ConfirmOptions,
	PendingConfirmation,
} from "./ConfirmModalContext.types";

const ConfirmModalContext = createContext<ConfirmModalContextValue | null>(null);

const ConfirmModalProvider = (props: ConfirmModalProviderProps) => {
	const { children } = props;
	const [pendingConfirmation, setPendingConfirmation] = useState<PendingConfirmation | null>(null);
	const pendingConfirmationRef = useRef<PendingConfirmation | null>(null);

	const closePendingConfirmation = useCallback((value: boolean) => {
		pendingConfirmationRef.current?.resolve(value);
		pendingConfirmationRef.current = null;
		setPendingConfirmation(null);
	}, []);

	const confirm = useCallback((options: ConfirmOptions) => {
		pendingConfirmationRef.current?.resolve(false);

		return new Promise<boolean>(resolve => {
			const nextConfirmation: PendingConfirmation = {
				cancelLabel: "Cancel",
				confirmLabel: "Confirm",
				variant: "default",
				...options,
				resolve,
			};

			pendingConfirmationRef.current = nextConfirmation;
			setPendingConfirmation(nextConfirmation);
		});
	}, []);

	return (
		<ConfirmModalContext.Provider value={{ confirm }}>
			{children}
			{pendingConfirmation ? (
				<ConfirmModal
					title={pendingConfirmation.title}
					message={pendingConfirmation.message}
					confirmLabel={pendingConfirmation.confirmLabel}
					cancelLabel={pendingConfirmation.cancelLabel}
					variant={pendingConfirmation.variant}
					onCancel={() => closePendingConfirmation(false)}
					onConfirm={() => closePendingConfirmation(true)}
				/>
			) : null}
		</ConfirmModalContext.Provider>
	);
};

const useConfirmModal = () => {
	const context = useContext(ConfirmModalContext);

	if (!context) {
		throw new Error("useConfirmModal must be used within ConfirmModalProvider");
	}

	return context;
};

export { ConfirmModalProvider, useConfirmModal };
export default ConfirmModalProvider;
