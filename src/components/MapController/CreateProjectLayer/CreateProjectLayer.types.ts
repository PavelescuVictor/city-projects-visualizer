import type Leaflet from "leaflet";
import type { CreateProjectDraft } from "../../../data/projects.types";

export interface CreateProjectLayerProps {
	map: Leaflet.Map | null;
	draft: CreateProjectDraft | null;
	onDraftChange: (draft: CreateProjectDraft) => void;
}
