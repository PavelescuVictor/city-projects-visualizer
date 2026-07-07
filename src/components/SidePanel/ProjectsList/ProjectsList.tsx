import { useProjectData, useProjectMapState } from "../../../contexts";
import { Button } from "../../basic";
import "./ProjectsList.css";

const ProjectsList = () => {
	const { filteredProjects, selectedProject } = useProjectData();
	const { onProjectToggleFocus } = useProjectMapState();

	return (
		<>
			<div className="project-list-divider">
				<span>{filteredProjects.length} shown</span>
			</div>

			<section className="project-list" aria-label="Visible projects">
				{filteredProjects.map(project => (
					<Button
						key={project.id}
						className={`project-item project-item-${project.type}${project.id === selectedProject?.id ? " is-selected" : ""}`}
						onClick={() => onProjectToggleFocus(project)}
					>
						<span className="project-item-dot" />
						<span>
							<strong>{project.name}</strong>
							<small>
								<span className="project-type-value">{project.type}</span> - {project.neighbourhood}
							</small>
						</span>
						<em>{project.status}</em>
					</Button>
				))}
			</section>
		</>
	);
};

export default ProjectsList;
