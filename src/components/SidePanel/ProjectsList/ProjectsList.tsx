import { useProjectData, useProjectMapState } from "../../../contexts";
import { PROJECT_TYPES } from "../../../data/projects";
import type { ProjectType } from "../../../data/projects.types";
import "./ProjectsList.css";

const PROJECT_TYPE_DOT_COLORS: Record<ProjectType, string> = {
	[PROJECT_TYPES.BUILDING]: "#2563eb",
	[PROJECT_TYPES.PARK]: "#047857",
	[PROJECT_TYPES.TRANSPORT_INFRASTRUCTURE]: "#ea580c",
	[PROJECT_TYPES.PUBLIC_SPACE]: "#7c3aed",
};

const ProjectsList = () => {
	const { filteredProjects, selectedProject } = useProjectData();
	const { onProjectToggleFocus } = useProjectMapState();

	return (
		<>
			<div className="project-list-divider">
				<span>{filteredProjects.length} shown</span>
			</div>

			<section className="project-list" aria-label="Visible projects">
				{filteredProjects.map(project => {
					const isSelected = project.id === selectedProject?.id;

					return (
						<button
							key={project.id}
							className={`project-row${isSelected ? " is-selected" : ""}`}
							data-project-id={project.id}
							type="button"
							onClick={() => onProjectToggleFocus(project)}
						>
							<span
								className="project-row-dot"
								style={{
									background: PROJECT_TYPE_DOT_COLORS[project.type],
								}}
							/>
							<span>
								<strong>{project.name}</strong>
								<small>
									<span className="project-type-value">{project.type}</span> - {project.neighbourhood}
								</small>
							</span>
							<em>{project.status}</em>
						</button>
					);
				})}
			</section>
		</>
	);
};

export default ProjectsList;
