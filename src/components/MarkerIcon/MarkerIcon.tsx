import { Building2, Landmark, Route, TreePine } from "lucide-react";
import type { ProjectType } from "../../types/project";

interface MarkerIconProps {
  type: ProjectType;
}

type MarkerIconComponent = typeof Building2;

const projectTypeIcons: Record<ProjectType, MarkerIconComponent> = {
  building: Building2,
  park: TreePine,
  "transport-infrastructure": Route,
  "public-space": Landmark,
};

export function MarkerIcon({ type }: MarkerIconProps) {
  const Icon = projectTypeIcons[type];

  return <Icon className="project-marker-icon" aria-hidden />;
}
