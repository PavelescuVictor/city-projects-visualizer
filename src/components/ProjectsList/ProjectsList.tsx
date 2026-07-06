import { PROJECT_TYPES } from "../../data/projects";
import type { ProjectType } from "../../data/projects.types";
import "./ProjectsList.css";
import type { ProjectsListProps } from "./ProjectsList.types";

const projectTypeDotColors: Record<ProjectType, string> = {
	[PROJECT_TYPES.BUILDING]: "#2563eb",
	[PROJECT_TYPES.PARK]: "#047857",
	[PROJECT_TYPES.TRANSPORT_INFRASTRUCTURE]: "#ea580c",
	[PROJECT_TYPES.PUBLIC_SPACE]: "#7c3aed",
};

const ProjectsList = (props: ProjectsListProps) => {
	const { projects, selectedProject, onProjectSelect } = props;

	return (
		<>
			<div className="project-list-divider">
				<span>{projects.length} shown</span>
			</div>

			<section className="project-list" aria-label="Visible projects">
				{projects.map(project => {
					const isSelected = project.id === selectedProject?.id;

					return (
						<button
							key={project.id}
							className={`project-row${isSelected ? " is-selected" : ""}`}
							data-project-id={project.id}
							type="button"
							onClick={() => onProjectSelect(project)}
						>
							<span
								className="project-row-dot"
								style={{
									background: projectTypeDotColors[project.type],
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

export { ProjectsList };
