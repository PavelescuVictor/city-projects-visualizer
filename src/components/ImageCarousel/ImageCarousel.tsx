import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./ImageCarousel.css";
import type { ProjectImage } from "../../types/project";

interface ImageCarouselProps {
  images: ProjectImage[];
  compact?: boolean;
}

export function ImageCarousel({ images, compact = false }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return null;
  }

  const activeImage = images[activeIndex] ?? images[0];
  const hasMultipleImages = images.length > 1;

  return (
    <div className={`image-carousel${compact ? " is-compact" : ""}`}>
      <img src={activeImage.src} alt={activeImage.alt} />
      {hasMultipleImages ? (
        <>
          <button
            className="carousel-button carousel-button-prev"
            type="button"
            aria-label="Previous image"
            onClick={() => setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1))}
          >
            <ChevronLeft size={17} aria-hidden="true" />
          </button>
          <button
            className="carousel-button carousel-button-next"
            type="button"
            aria-label="Next image"
            onClick={() => setActiveIndex((current) => (current + 1) % images.length)}
          >
            <ChevronRight size={17} aria-hidden="true" />
          </button>
          <span className="carousel-count">
            {activeIndex + 1}/{images.length}
          </span>
        </>
      ) : null}
    </div>
  );
}
