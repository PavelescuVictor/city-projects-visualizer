import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { projects as initialProjects, PROJECT_STATUSES } from "../../data/projects";
import type { CreateProjectDraft, Project, ProjectStatus } from "../../data/projects.types";
import { loadProjects, saveProjects } from "../../services/projectService";
import { useAppState } from "../AppStateContext";
import { useConfirmModal } from "../ConfirmModalContext";
import type {
	ProjectDataContextValue,
	ProjectEditingContextValue,
	ProjectFiltersContextValue,
	ProjectMapStateContextValue,
	ProjectSaveStatus,
	ProjectsContextValue,
	ProjectsProviderProps,
} from "./ProjectsContext.types";

const allStatuses = Object.values(PROJECT_STATUSES);
const ProjectsContext = createContext<ProjectsContextValue | null>(null);

function normalizeWebsiteUrl(value: string) {
	const trimmedValue = value.trim();

	if (!trimmedValue || /^https?:\/\//i.test(trimmedValue)) {
		return trimmedValue;
	}

	return `https://${trimmedValue}`;
}

function slugify(value: string) {
	return (
		value
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "") || "new-project"
	);
}

function createProjectId(name: string, projects: Project[]) {
	const baseId = slugify(name);
	const usedIds = new Set(projects.map(project => project.id));
	let candidateId = baseId;
	let index = 2;

	while (usedIds.has(candidateId)) {
		candidateId = `${baseId}-${index}`;
		index += 1;
	}

	return candidateId;
}

const ProjectsProvider = (props: ProjectsProviderProps) => {
	const { children } = props;
	const { editPermitted, inEditMode, inCreateMode, switchToViewState, switchToEditState, switchToCreateState } =
		useAppState();
	const { confirm } = useConfirmModal();
	const [projects, setProjects] = useState<Project[]>(editPermitted ? [] : initialProjects);
	const projectsRef = useRef<Project[]>(editPermitted ? [] : initialProjects);
	const savedProjectsRef = useRef<Project[]>(editPermitted ? [] : initialProjects);
	const [selectedProjectId, setSelectedProjectId] = useState("");
	const selectedProjectIdRef = useRef("");
	const [activeStatuses, setActiveStatuses] = useState<ProjectStatus[]>(allStatuses);
	const [searchTerm, setSearchTerm] = useState("");
	const [resetSignal, setResetSignal] = useState(0);
	const [focusRequest, setFocusRequest] = useState({
		projectId: "",
		requestId: 0,
	});
	const [createDraft, setCreateDraft] = useState<CreateProjectDraft | null>(null);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [saveStatus, setSaveStatus] = useState<ProjectSaveStatus>("idle");
	const [createSaveStatus, setCreateSaveStatus] = useState<ProjectSaveStatus>("idle");

	useEffect(() => {
		selectedProjectIdRef.current = selectedProjectId;
	}, [selectedProjectId]);

	useEffect(() => {
		loadProjects()
			.then(projectData => {
				savedProjectsRef.current = projectData;
				projectsRef.current = projectData;
				setProjects(projectData);
				setSelectedProjectId(current => (projectData.some(project => project.id === current) ? current : ""));
			})
			.catch(() => {
				savedProjectsRef.current = initialProjects;
				projectsRef.current = initialProjects;
				setProjects(initialProjects);
				setSelectedProjectId(current =>
					initialProjects.some(project => project.id === current) ? current : "",
				);
			});
	}, []);

	const filteredProjects = useMemo(() => {
		const normalizedSearch = searchTerm.trim().toLowerCase();

		return projects.filter(project => {
			const matchesStatus = activeStatuses.includes(project.status);
			const matchesSearch =
				normalizedSearch.length === 0 ||
				[project.name, project.type, project.address, project.neighbourhood]
					.filter(Boolean)
					.some(value => value?.toLowerCase().includes(normalizedSearch));

			return matchesStatus && matchesSearch;
		});
	}, [activeStatuses, projects, searchTerm]);

	const selectedProject = filteredProjects.find(project => project.id === selectedProjectId);

	const clearProjectSelection = useCallback(() => {
		setSelectedProjectId("");
		switchToViewState();
		setFocusRequest(current => ({
			projectId: "",
			requestId: current.requestId,
		}));
	}, [switchToViewState]);

	const closeCreateMode = useCallback(() => {
		if (inCreateMode) {
			switchToViewState();
		}

		setCreateDraft(null);
		setCreateSaveStatus("idle");
	}, [inCreateMode, switchToViewState]);

	const discardUnsavedEditChanges = useCallback(() => {
		if (!inEditMode || !hasUnsavedChanges) {
			return;
		}

		const savedProjects = savedProjectsRef.current;
		projectsRef.current = savedProjects;
		setProjects(savedProjects);
		setHasUnsavedChanges(false);
		setSaveStatus("idle");
	}, [hasUnsavedChanges, inEditMode]);

	const discardUnsavedEditChangesBeforeSelection = useCallback(
		(nextProjectId: string) => {
			const isSwitchingProjects = nextProjectId !== selectedProjectIdRef.current;

			if (!isSwitchingProjects) {
				return;
			}

			discardUnsavedEditChanges();
		},
		[discardUnsavedEditChanges],
	);

	const handleStatusToggle = useCallback(
		(status: ProjectStatus) => {
			clearProjectSelection();
			setActiveStatuses(current => {
				if (current.includes(status)) {
					return current.filter(item => item !== status);
				}

				return [...current, status];
			});
		},
		[clearProjectSelection],
	);

	const handleSearchChange = useCallback(
		(value: string) => {
			clearProjectSelection();
			setSearchTerm(value);
		},
		[clearProjectSelection],
	);

	const handleProjectSelect = useCallback(
		(project: Project) => {
			closeCreateMode();
			discardUnsavedEditChangesBeforeSelection(project.id);

			if (project.id !== selectedProjectIdRef.current) {
				switchToViewState();
			}

			setSelectedProjectId(project.id);
		},
		[closeCreateMode, discardUnsavedEditChangesBeforeSelection, switchToViewState],
	);

	const handleProjectFocus = useCallback(
		(project: Project) => {
			closeCreateMode();
			discardUnsavedEditChangesBeforeSelection(project.id);

			if (project.id !== selectedProjectIdRef.current) {
				switchToViewState();
			}

			setSelectedProjectId(project.id);
			setFocusRequest(current => ({
				projectId: project.id,
				requestId: current.requestId + 1,
			}));
		},
		[closeCreateMode, discardUnsavedEditChangesBeforeSelection, switchToViewState],
	);

	const handleProjectToggleFocus = useCallback(
		(project: Project) => {
			closeCreateMode();

			if (project.id === selectedProjectIdRef.current) {
				discardUnsavedEditChanges();
				clearProjectSelection();
				setResetSignal(value => value + 1);
				return;
			}

			discardUnsavedEditChangesBeforeSelection(project.id);
			switchToViewState();
			setSelectedProjectId(project.id);
			setFocusRequest(current => ({
				projectId: project.id,
				requestId: current.requestId + 1,
			}));
		},
		[
			clearProjectSelection,
			closeCreateMode,
			discardUnsavedEditChanges,
			discardUnsavedEditChangesBeforeSelection,
			switchToViewState,
		],
	);

	const handleCameraChangedByUser = useCallback(() => {
		setFocusRequest(current => (current.projectId ? { projectId: "", requestId: current.requestId } : current));
	}, []);

	const handleMapReset = useCallback(() => {
		closeCreateMode();
		clearProjectSelection();
		setResetSignal(value => value + 1);
	}, [clearProjectSelection, closeCreateMode]);

	const handleProjectEdit = useCallback(
		(project: Project) => {
			if (!editPermitted) {
				return;
			}

			closeCreateMode();
			setSelectedProjectId(project.id);
			if (inEditMode && selectedProjectIdRef.current === project.id) {
				switchToViewState();
				return;
			}

			switchToEditState();
		},
		[closeCreateMode, editPermitted, inEditMode, switchToEditState, switchToViewState],
	);

	const handleCreateStart = useCallback(() => {
		if (!editPermitted) {
			return;
		}

		switchToCreateState();
		setSelectedProjectId("");
		setFocusRequest(current => ({
			projectId: "",
			requestId: current.requestId,
		}));
		setCreateDraft(null);
		setCreateSaveStatus("idle");
	}, [editPermitted, switchToCreateState]);

	const handleCreateCancel = useCallback(() => {
		closeCreateMode();
		clearProjectSelection();
	}, [clearProjectSelection, closeCreateMode]);

	const handleProjectChange = useCallback(
		(updatedProject: Project) => {
			if (!editPermitted) {
				return;
			}

			setProjects(currentProjects => {
				const nextProjects = currentProjects.map(project =>
					project.id === updatedProject.id ? { ...project, ...updatedProject } : project,
				);

				projectsRef.current = nextProjects;
				return nextProjects;
			});
			setSelectedProjectId(updatedProject.id);
			setHasUnsavedChanges(true);
			setSaveStatus("idle");
		},
		[editPermitted],
	);

	const deleteProject = useCallback(
		async (projectToDelete: Project) => {
			const previousProjects = projectsRef.current;
			const nextProjects = previousProjects.filter(project => project.id !== projectToDelete.id);

			projectsRef.current = nextProjects;
			setProjects(nextProjects);
			setSelectedProjectId(nextProjects[0]?.id ?? "");
			switchToViewState();
			setHasUnsavedChanges(false);
			setSaveStatus("saving");

			try {
				const savedProjects = await saveProjects(nextProjects);

				projectsRef.current = savedProjects;
				savedProjectsRef.current = savedProjects;
				setProjects(savedProjects);
				setSelectedProjectId(current => (savedProjects.some(project => project.id === current) ? current : ""));
				setSaveStatus("saved");
			} catch {
				projectsRef.current = previousProjects;
				setProjects(previousProjects);
				setSelectedProjectId(current =>
					previousProjects.some(project => project.id === current) ? current : "",
				);
				setSaveStatus("error");
			}
		},
		[switchToViewState],
	);

	const handleProjectDelete = useCallback(
		async (projectToDelete: Project) => {
			if (!editPermitted) {
				return;
			}

			const shouldDelete = await confirm({
				title: "Delete project?",
				message: (
					<>
						This removes <strong>{projectToDelete.name}</strong> from the local project list.
					</>
				),
				confirmLabel: "Delete",
				variant: "danger",
			});

			if (shouldDelete) {
				await deleteProject(projectToDelete);
			}
		},
		[confirm, deleteProject, editPermitted],
	);

	const handleSaveProjects = useCallback(async () => {
		if (!editPermitted) {
			return;
		}

		setSaveStatus("saving");

		try {
			const projectsToSave = projectsRef.current;
			const savedProjects = await saveProjects(projectsToSave);

			projectsRef.current = savedProjects;
			savedProjectsRef.current = savedProjects;
			setProjects(savedProjects);
			setHasUnsavedChanges(false);
			setSaveStatus("saved");
		} catch {
			setSaveStatus("error");
		}
	}, [editPermitted]);

	const handleRevertProjects = useCallback(async () => {
		if (!editPermitted) {
			return;
		}

		try {
			const savedProjects = await loadProjects();

			projectsRef.current = savedProjects;
			savedProjectsRef.current = savedProjects;
			setProjects(savedProjects);
			setSelectedProjectId(current => (savedProjects.some(project => project.id === current) ? current : ""));
			setHasUnsavedChanges(false);
			setSaveStatus("idle");
		} catch {
			setSaveStatus("error");
		}
	}, [editPermitted]);

	const handleCreateDraftChange = useCallback((draft: CreateProjectDraft) => {
		setCreateDraft(draft);
	}, []);

	const handleCreateSave = useCallback(async () => {
		if (!editPermitted || !createDraft) {
			return;
		}

		const trimmedName = createDraft.name.trim();
		const trimmedAddress = createDraft.address.trim();
		const trimmedNeighbourhood = createDraft.neighbourhood.trim();
		const websiteUrl = normalizeWebsiteUrl(createDraft.websiteUrl);

		if (!trimmedName || !trimmedAddress || !trimmedNeighbourhood || !websiteUrl) {
			return;
		}

		const newProject: Project = {
			id: createProjectId(trimmedName, projectsRef.current),
			name: trimmedName,
			type: "building",
			status: "planning",
			address: trimmedAddress,
			neighbourhood: trimmedNeighbourhood,
			websiteUrl,
			images: [],
			coordinates: createDraft.coordinates,
			parcelPolygon: createDraft.parcelPolygon,
		};

		setCreateSaveStatus("saving");

		try {
			const nextProjects = [...projectsRef.current, newProject];
			const savedProjects = await saveProjects(nextProjects);

			projectsRef.current = savedProjects;
			savedProjectsRef.current = savedProjects;
			setProjects(savedProjects);
			setActiveStatuses(current => (current.includes("planning") ? current : [...current, "planning"]));
			setSelectedProjectId(newProject.id);
			switchToViewState();
			setCreateDraft(null);
			setCreateSaveStatus("saved");
		} catch {
			setCreateSaveStatus("error");
		}
	}, [createDraft, editPermitted, switchToViewState]);

	const value = useMemo<ProjectsContextValue>(
		() => ({
			projects,
			filteredProjects,
			selectedProject,
			statuses: allStatuses,
			activeStatuses,
			searchTerm,
			focusedProjectId: focusRequest.projectId,
			hasUnsavedChanges,
			saveStatus,
			createSaveStatus,
			createDraft,
			focusProjectId: focusRequest.projectId,
			focusSignal: focusRequest.requestId,
			resetSignal,
			onSearchChange: handleSearchChange,
			onStatusToggle: handleStatusToggle,
			onCreateDraftChange: handleCreateDraftChange,
			onCreateProject: handleCreateStart,
			onCreateSave: handleCreateSave,
			onCreateCancel: handleCreateCancel,
			onProjectChange: handleProjectChange,
			onProjectEdit: handleProjectEdit,
			onProjectDeleteRequest: handleProjectDelete,
			onSaveProjects: handleSaveProjects,
			onRevertProjects: handleRevertProjects,
			onProjectSelect: handleProjectSelect,
			onProjectFocus: handleProjectFocus,
			onProjectToggleFocus: handleProjectToggleFocus,
			onCameraChangedByUser: handleCameraChangedByUser,
			onReset: handleMapReset,
		}),
		[
			activeStatuses,
			createDraft,
			createSaveStatus,
			filteredProjects,
			focusRequest.projectId,
			focusRequest.requestId,
			handleCameraChangedByUser,
			handleCreateCancel,
			handleCreateDraftChange,
			handleCreateSave,
			handleCreateStart,
			handleMapReset,
			handleProjectChange,
			handleProjectDelete,
			handleProjectEdit,
			handleProjectFocus,
			handleProjectSelect,
			handleProjectToggleFocus,
			handleRevertProjects,
			handleSaveProjects,
			handleSearchChange,
			handleStatusToggle,
			hasUnsavedChanges,
			projects,
			resetSignal,
			saveStatus,
			searchTerm,
			selectedProject,
		],
	);

	return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
};

const useProjectsContext = () => {
	const context = useContext(ProjectsContext);

	if (!context) {
		throw new Error("Projects hooks must be used within ProjectsProvider");
	}

	return context;
};

const useProjectData = (): ProjectDataContextValue => {
	const context = useProjectsContext();

	return {
		projects: context.projects,
		filteredProjects: context.filteredProjects,
		selectedProject: context.selectedProject,
		statuses: context.statuses,
		activeStatuses: context.activeStatuses,
		searchTerm: context.searchTerm,
		focusedProjectId: context.focusedProjectId,
		hasUnsavedChanges: context.hasUnsavedChanges,
		saveStatus: context.saveStatus,
		createSaveStatus: context.createSaveStatus,
	};
};

const useProjectFilters = (): ProjectFiltersContextValue => {
	const context = useProjectsContext();

	return {
		searchTerm: context.searchTerm,
		activeStatuses: context.activeStatuses,
		statuses: context.statuses,
		onSearchChange: context.onSearchChange,
		onStatusToggle: context.onStatusToggle,
	};
};

const useProjectEditing = (): ProjectEditingContextValue => {
	const context = useProjectsContext();

	return {
		createDraft: context.createDraft,
		createSaveStatus: context.createSaveStatus,
		hasUnsavedChanges: context.hasUnsavedChanges,
		saveStatus: context.saveStatus,
		onCreateDraftChange: context.onCreateDraftChange,
		onCreateProject: context.onCreateProject,
		onCreateSave: context.onCreateSave,
		onCreateCancel: context.onCreateCancel,
		onProjectChange: context.onProjectChange,
		onProjectEdit: context.onProjectEdit,
		onProjectDeleteRequest: context.onProjectDeleteRequest,
		onSaveProjects: context.onSaveProjects,
		onRevertProjects: context.onRevertProjects,
	};
};

const useProjectMapState = (): ProjectMapStateContextValue => {
	const context = useProjectsContext();

	return {
		focusProjectId: context.focusProjectId,
		focusSignal: context.focusSignal,
		resetSignal: context.resetSignal,
		onProjectSelect: context.onProjectSelect,
		onProjectFocus: context.onProjectFocus,
		onProjectToggleFocus: context.onProjectToggleFocus,
		onCameraChangedByUser: context.onCameraChangedByUser,
		onReset: context.onReset,
	};
};

export { ProjectsProvider, useProjectData, useProjectEditing, useProjectFilters, useProjectMapState };
export default ProjectsProvider;
