import type { ProjectImage } from "../../data/projects.types";

export interface ImageCarouselProps {
  images: ProjectImage[];
  compact?: boolean;
}
