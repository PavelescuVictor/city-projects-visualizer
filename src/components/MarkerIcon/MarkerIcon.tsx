import { Building2, Landmark, Route, TreePine } from "lucide-react";
import type { ProjectType } from "../../data/projects.types";
import type { MarkerIconProps } from "./MarkerIcon.types";

type MarkerIconComponent = typeof Building2;

const projectTypeIcons: Record<ProjectType, MarkerIconComponent> = {
	building: Building2,
	park: TreePine,
	"transport-infrastructure": Route,
	"public-space": Landmark,
};

const MarkerIcon = (props: MarkerIconProps) => {
	const { type } = props;
	const Icon = projectTypeIcons[type];

	return <Icon className="project-marker-icon" aria-hidden />;
};

export default MarkerIcon;
