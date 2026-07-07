import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../Button";
import "./ImageCarousel.css";
import type { ImageCarouselProps } from "./ImageCarousel.types";

const ImageCarousel = (props: ImageCarouselProps) => {
	const { images } = props;
	const imagesCount = images.length;
	const [activeIndex, setActiveIndex] = useState(0);

	if (imagesCount === 0) {
		return null;
	}

	const activeImage = images[activeIndex] ?? images[0];
	const hasMultipleImages = imagesCount > 1;

	return (
		<div className="image-carousel">
			<img src={activeImage.src} alt={activeImage.alt} />
			{hasMultipleImages ? (
				<>
					<Button
						className="carousel-button carousel-button-prev"
						aria-label="Previous image"
						onClick={() => setActiveIndex(current => (current === 0 ? imagesCount - 1 : current - 1))}
					>
						<ChevronLeft size={17} aria-hidden="true" />
					</Button>
					<Button
						className="carousel-button carousel-button-next"
						aria-label="Next image"
						onClick={() => setActiveIndex(current => (current + 1) % imagesCount)}
					>
						<ChevronRight size={17} aria-hidden="true" />
					</Button>
					<span className="carousel-count">
						{activeIndex + 1}/{imagesCount}
					</span>
				</>
			) : null}
		</div>
	);
};

export default ImageCarousel;
