import "./ProjectMeta.css";
import type { ProjectMetaProps } from "./ProjectMeta.types";

const ProjectMeta = (props: ProjectMetaProps) => {
	const { project } = props;

	return (
		<dl className="project-meta">
			<div className="project-meta-combined">
				<div>
					<dt>Type</dt>
					<dd className={`project-type-value project-type-value-${project.type}`}>{project.type}</dd>
				</div>
				<div>
					<dt>Neighbourhood</dt>
					<dd>{project.neighbourhood}</dd>
				</div>
			</div>
			<div>
				<dt>Address</dt>
				<dd>{project.address}</dd>
			</div>
		</dl>
	);
};

export default ProjectMeta;
