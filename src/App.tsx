import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import "./App.css";
import {
    MapLayerToggles,
    MapView,
    ProjectDetailsPanel,
    ProjectFilters,
} from "./components";
import { projects as initialProjects, PROJECT_STATUSES } from "./data/projects";
import type {
    CreateProjectDraft,
    Project,
    ProjectStatus,
} from "./data/projects.types";
import { loadProjects, saveProjects } from "./services/projectService";

const allStatuses = Object.values(PROJECT_STATUSES);
const canEdit = import.meta.env.DEV;

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
    const usedIds = new Set(projects.map((project) => project.id));
    let candidateId = baseId;
    let index = 2;

    while (usedIds.has(candidateId)) {
        candidateId = `${baseId}-${index}`;
        index += 1;
    }

    return candidateId;
}

export default function App() {
    const [projects, setProjects] = useState<Project[]>(
        canEdit ? [] : initialProjects
    );
    const projectsRef = useRef<Project[]>(
        canEdit ? [] : initialProjects
    );
    const savedProjectsRef = useRef<Project[]>(
        canEdit ? [] : initialProjects
    );
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const selectedProjectIdRef = useRef("");
    const [activeStatuses, setActiveStatuses] =
        useState<ProjectStatus[]>(allStatuses);
    const [searchTerm, setSearchTerm] = useState("");
    const [showParcels, setShowParcels] = useState(true);
    const [showMarkers, setShowMarkers] = useState(true);
    const [resetSignal, setResetSignal] = useState(0);
    const [focusRequest, setFocusRequest] = useState({
        projectId: "",
        requestId: 0,
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [createDraft, setCreateDraft] = useState<CreateProjectDraft | null>(
        null
    );
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [saveStatus, setSaveStatus] = useState<
        "idle" | "saving" | "saved" | "error"
    >("idle");
    const [createSaveStatus, setCreateSaveStatus] = useState<
        "idle" | "saving" | "saved" | "error"
    >("idle");
    const [projectPendingDelete, setProjectPendingDelete] =
        useState<Project | null>(null);

    useEffect(() => {
        selectedProjectIdRef.current = selectedProjectId;
    }, [selectedProjectId]);

    useEffect(() => {
        loadProjects()
            .then((projectData) => {
                savedProjectsRef.current = projectData;
                projectsRef.current = projectData;
                setProjects(projectData);
                setSelectedProjectId((current) =>
                    projectData.some((project) => project.id === current)
                        ? current
                        : ""
                );
            })
            .catch(() => {
                savedProjectsRef.current = initialProjects;
                projectsRef.current = initialProjects;
                setProjects(initialProjects);
                setSelectedProjectId((current) =>
                    initialProjects.some((project) => project.id === current)
                        ? current
                        : ""
                );
            });
    }, []);

    const filteredProjects = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return projects.filter((project) => {
            const matchesStatus = activeStatuses.includes(project.status);
            const matchesSearch =
                normalizedSearch.length === 0 ||
                [
                    project.name,
                    project.type,
                    project.address,
                    project.neighbourhood,
                ]
                    .filter(Boolean)
                    .some((value) =>
                        value?.toLowerCase().includes(normalizedSearch)
                    );

            return matchesStatus && matchesSearch;
        });
    }, [activeStatuses, projects, searchTerm]);

    const selectedProject = filteredProjects.find(
        (project) => project.id === selectedProjectId
    );

    const clearProjectSelection = useCallback(() => {
        setSelectedProjectId("");
        setIsEditMode(false);
        setFocusRequest((current) => ({
            projectId: "",
            requestId: current.requestId,
        }));
    }, []);

    const closeCreateMode = useCallback(() => {
        setIsCreateMode(false);
        setCreateDraft(null);
        setCreateSaveStatus("idle");
    }, []);

    const discardUnsavedEditChanges = useCallback(() => {
        if (!isEditMode || !hasUnsavedChanges) {
            return;
        }

        const savedProjects = savedProjectsRef.current;
        projectsRef.current = savedProjects;
        setProjects(savedProjects);
        setHasUnsavedChanges(false);
        setSaveStatus("idle");
    }, [hasUnsavedChanges, isEditMode]);

    const discardUnsavedEditChangesBeforeSelection = useCallback(
        (nextProjectId: string) => {
            const isSwitchingProjects =
                nextProjectId !== selectedProjectIdRef.current;

            if (!isSwitchingProjects) {
                return;
            }

            discardUnsavedEditChanges();
        },
        [discardUnsavedEditChanges]
    );

    const handleStatusToggle = useCallback(
        (status: ProjectStatus) => {
            clearProjectSelection();
            setActiveStatuses((current) => {
                if (current.includes(status)) {
                    return current.filter((item) => item !== status);
                }

                return [...current, status];
            });
        },
        [clearProjectSelection]
    );

    const handleSearchChange = useCallback(
        (value: string) => {
            clearProjectSelection();
            setSearchTerm(value);
        },
        [clearProjectSelection]
    );

    const handleProjectSelect = useCallback(
        (project: Project) => {
            closeCreateMode();
            discardUnsavedEditChangesBeforeSelection(project.id);

            if (project.id !== selectedProjectIdRef.current) {
                setIsEditMode(false);
            }

            setSelectedProjectId(project.id);
        },
        [closeCreateMode, discardUnsavedEditChangesBeforeSelection]
    );

    const handleProjectFocus = useCallback(
        (project: Project) => {
            closeCreateMode();
            discardUnsavedEditChangesBeforeSelection(project.id);

            if (project.id !== selectedProjectIdRef.current) {
                setIsEditMode(false);
            }

            setSelectedProjectId(project.id);
            setFocusRequest((current) => ({
                projectId: project.id,
                requestId: current.requestId + 1,
            }));
        },
        [closeCreateMode, discardUnsavedEditChangesBeforeSelection]
    );

    const handleProjectToggleFocus = useCallback(
        (project: Project) => {
            closeCreateMode();

            if (project.id === selectedProjectIdRef.current) {
                discardUnsavedEditChanges();
                clearProjectSelection();
                setResetSignal((value) => value + 1);
                return;
            }

            discardUnsavedEditChangesBeforeSelection(project.id);
            setIsEditMode(false);
            setSelectedProjectId(project.id);
            setFocusRequest((current) => ({
                projectId: project.id,
                requestId: current.requestId + 1,
            }));
        },
        [
            clearProjectSelection,
            closeCreateMode,
            discardUnsavedEditChanges,
            discardUnsavedEditChangesBeforeSelection,
        ]
    );

    const handleCameraChangedByUser = useCallback(() => {
        setFocusRequest((current) =>
            current.projectId
                ? { projectId: "", requestId: current.requestId }
                : current
        );
    }, []);

    const handleMapReset = useCallback(() => {
        closeCreateMode();
        clearProjectSelection();
        setResetSignal((value) => value + 1);
    }, [clearProjectSelection, closeCreateMode]);

    const handleProjectEdit = useCallback(
        (project: Project) => {
            if (!canEdit) {
                return;
            }

            closeCreateMode();
            setSelectedProjectId(project.id);
            setIsEditMode((current) =>
                current && selectedProjectIdRef.current === project.id
                    ? false
                    : true
            );
        },
        [closeCreateMode]
    );

    const handleCreateStart = useCallback(() => {
        if (!canEdit) {
            return;
        }

        setIsEditMode(false);
        setSelectedProjectId("");
        setFocusRequest((current) => ({
            projectId: "",
            requestId: current.requestId,
        }));
        setIsCreateMode(true);
        setCreateDraft(null);
        setCreateSaveStatus("idle");
    }, []);

    const handleCreateCancel = useCallback(() => {
        closeCreateMode();
        clearProjectSelection();
    }, [clearProjectSelection, closeCreateMode]);

    const handleProjectChange = useCallback(
        (updatedProject: Project) => {
            if (!canEdit) {
                return;
            }

            setProjects((currentProjects) => {
                const nextProjects = currentProjects.map((project) =>
                    project.id === updatedProject.id
                        ? { ...project, ...updatedProject }
                        : project
                );

                projectsRef.current = nextProjects;
                return nextProjects;
            });
            setSelectedProjectId(updatedProject.id);
            setHasUnsavedChanges(true);
            setSaveStatus("idle");
        },
        []
    );

    const handleProjectDelete = useCallback(
        async (projectToDelete: Project) => {
            if (!canEdit) {
                return;
            }

            const previousProjects = projectsRef.current;
            const nextProjects = previousProjects.filter(
                (project) => project.id !== projectToDelete.id
            );

            projectsRef.current = nextProjects;
            setProjects(nextProjects);
            setSelectedProjectId(nextProjects[0]?.id ?? "");
            setIsEditMode(false);
            setHasUnsavedChanges(false);
            setSaveStatus("saving");

            try {
                const savedProjects = await saveProjects(nextProjects);

                projectsRef.current = savedProjects;
                savedProjectsRef.current = savedProjects;
                setProjects(savedProjects);
                setSelectedProjectId((current) =>
                    savedProjects.some((project) => project.id === current)
                        ? current
                        : ""
                );
                setSaveStatus("saved");
            } catch {
                projectsRef.current = previousProjects;
                setProjects(previousProjects);
                setSelectedProjectId((current) =>
                    previousProjects.some((project) => project.id === current)
                        ? current
                        : ""
                );
                setSaveStatus("error");
            }
        },
        []
    );

    async function handleSaveProjects() {
        if (!canEdit) {
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
        if (!canEdit) {
            return;
        }

        try {
            const savedProjects = await loadProjects();

            projectsRef.current = savedProjects;
            savedProjectsRef.current = savedProjects;
            setProjects(savedProjects);
            setSelectedProjectId((current) =>
                savedProjects.some((project) => project.id === current)
                    ? current
                    : ""
            );
            setHasUnsavedChanges(false);
            setSaveStatus("idle");
        } catch {
            setSaveStatus("error");
        }
    }

    async function handleCreateSave() {
        if (!canEdit) {
            return;
        }

        if (!createDraft) {
            return;
        }

        const trimmedName = createDraft.name.trim();
        const trimmedAddress = createDraft.address.trim();
        const trimmedNeighbourhood = createDraft.neighbourhood.trim();
        const websiteUrl = normalizeWebsiteUrl(createDraft.websiteUrl);

        if (
            !trimmedName ||
            !trimmedAddress ||
            !trimmedNeighbourhood ||
            !websiteUrl
        ) {
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
            setActiveStatuses((current) =>
                current.includes("planning")
                    ? current
                    : [...current, "planning"]
            );
            setSelectedProjectId(newProject.id);
            setIsCreateMode(false);
            setCreateDraft(null);
            setIsEditMode(false);
            setCreateSaveStatus("saved");
        } catch {
            setCreateSaveStatus("error");
        }
    }

    return (
        <main className="app-shell">
            <section className="map-stage" aria-label="City development map">
                <MapView
                    projects={filteredProjects}
                    allProjects={projects}
                    selectedProjectId={selectedProject?.id}
                    focusProjectId={focusRequest.projectId}
                    focusSignal={focusRequest.requestId}
                    showParcels={showParcels}
                    showMarkers={showMarkers}
                    editMode={canEdit && isEditMode}
                    createMode={canEdit && isCreateMode}
                    canEdit={canEdit}
                    createDraft={createDraft}
                    resetSignal={resetSignal}
                    onProjectSelect={handleProjectSelect}
                    onProjectChange={handleProjectChange}
                    onCreateDraftChange={setCreateDraft}
                    onProjectEdit={handleProjectEdit}
                    onProjectDeleteRequest={setProjectPendingDelete}
                    onCameraChangedByUser={handleCameraChangedByUser}
                />
                <MapLayerToggles
                    showParcels={showParcels}
                    showMarkers={showMarkers}
                    onShowParcelsChange={setShowParcels}
                    onShowMarkersChange={setShowMarkers}
                />
                <button
                    className="icon-button map-reset-button"
                    type="button"
                    aria-label="Reset map view"
                    title="Reset map view"
                    onClick={handleMapReset}
                >
                    <RotateCcw size={18} aria-hidden="true" />
                </button>
            </section>

            <aside className="control-panel" aria-label="Project controls">
                <ProjectFilters
                    statuses={allStatuses}
                    activeStatuses={activeStatuses}
                    searchTerm={searchTerm}
                    isCreateMode={isCreateMode}
                    canEdit={canEdit}
                    onSearchChange={handleSearchChange}
                    onCreateProject={handleCreateStart}
                    onStatusToggle={handleStatusToggle}
                />

                <ProjectDetailsPanel
                    projects={filteredProjects}
                    selectedProject={selectedProject}
                    focusedProjectId={focusRequest.projectId}
                    isCreateMode={canEdit && isCreateMode}
                    createDraft={createDraft}
                    createSaveStatus={createSaveStatus}
                    canEdit={canEdit}
                    onProjectSelect={handleProjectToggleFocus}
                    onProjectFocus={handleProjectFocus}
                    isEditMode={isEditMode}
                    hasUnsavedChanges={hasUnsavedChanges}
                    saveStatus={saveStatus}
                    onCreateDraftChange={setCreateDraft}
                    onCreateSave={handleCreateSave}
                    onCreateCancel={handleCreateCancel}
                    onProjectEdit={handleProjectEdit}
                    onProjectDeleteRequest={setProjectPendingDelete}
                    onSaveProjects={handleSaveProjects}
                    onRevertProjects={handleRevertProjects}
                />
            </aside>

            {canEdit && projectPendingDelete ? (
                <div className="modal-backdrop" role="presentation">
                    <div
                        className="confirm-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-project-title"
                    >
                        <h3 id="delete-project-title">Delete project?</h3>
                        <p>
                            This removes{" "}
                            <strong>{projectPendingDelete.name}</strong> from
                            the local project list.
                        </p>
                        <div className="modal-actions">
                            <button
                                className="modal-secondary-button"
                                type="button"
                                onClick={() => setProjectPendingDelete(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-danger-button"
                                type="button"
                                onClick={() => {
                                    void handleProjectDelete(
                                        projectPendingDelete
                                    );
                                    setProjectPendingDelete(null);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </main>
    );
}
