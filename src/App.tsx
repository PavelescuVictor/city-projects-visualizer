import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { DeleteConfirmModalProvider, MapController, SideController } from "./components";
import { useAppState } from "./contexts";
import { projects as initialProjects, PROJECT_STATUSES } from "./data/projects";
import type { CreateProjectDraft, Project, ProjectStatus } from "./data/projects.types";
import { loadProjects, saveProjects } from "./services/projectService";

const allStatuses = Object.values(PROJECT_STATUSES);

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

const App = () => {
	const { editPermitted, inEditMode, inCreateMode, switchToViewState, switchToEditState, switchToCreateState } =
		useAppState();
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
	const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
	const [createSaveStatus, setCreateSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

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

	const handleProjectDelete = useCallback(
		async (projectToDelete: Project) => {
			if (!editPermitted) {
				return;
			}

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
		[editPermitted, switchToViewState],
	);

	async function handleSaveProjects() {
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
	}

	async function handleRevertProjects() {
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
	}

	async function handleCreateSave() {
		if (!editPermitted) {
			return;
		}

		if (!createDraft) {
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
	}

	return (
		<DeleteConfirmModalProvider>
			<main className="app-shell">
				<MapController
					projects={filteredProjects}
					allProjects={projects}
					selectedProject={selectedProject}
					focusProjectId={focusRequest.projectId}
					focusSignal={focusRequest.requestId}
					createDraft={createDraft}
					resetSignal={resetSignal}
					onProjectSelect={handleProjectSelect}
					onProjectChange={handleProjectChange}
					onCreateDraftChange={setCreateDraft}
					onProjectEdit={handleProjectEdit}
					onProjectDeleteRequest={handleProjectDelete}
					onCameraChangedByUser={handleCameraChangedByUser}
					onReset={handleMapReset}
				/>

				<SideController
					projects={filteredProjects}
					selectedProject={selectedProject}
					focusedProjectId={focusRequest.projectId}
					statuses={allStatuses}
					activeStatuses={activeStatuses}
					searchTerm={searchTerm}
					createDraft={createDraft}
					createSaveStatus={createSaveStatus}
					hasUnsavedChanges={hasUnsavedChanges}
					saveStatus={saveStatus}
					onSearchChange={handleSearchChange}
					onCreateProject={handleCreateStart}
					onStatusToggle={handleStatusToggle}
					onProjectSelect={handleProjectToggleFocus}
					onProjectFocus={handleProjectFocus}
					onCreateDraftChange={setCreateDraft}
					onCreateSave={handleCreateSave}
					onCreateCancel={handleCreateCancel}
					onProjectEdit={handleProjectEdit}
					onProjectDeleteRequest={handleProjectDelete}
					onSaveProjects={handleSaveProjects}
					onRevertProjects={handleRevertProjects}
				/>
			</main>
		</DeleteConfirmModalProvider>
	);
};

export default App;
