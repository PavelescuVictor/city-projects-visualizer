import type { CreateProjectDraft } from "../../data/projects.types";

export interface CreateProjectPanelProps {
  draft: CreateProjectDraft | null;
  saveStatus: "idle" | "saving" | "saved" | "error";
  onDraftChange: (draft: CreateProjectDraft) => void;
  onSave: () => void;
  onRevert: () => void;
}
