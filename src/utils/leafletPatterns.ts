import type Leaflet from "leaflet";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const STRIPE_PATTERN_ID_PREFIX = "polygon-stripes";
const STRIPE_PATTERN_SIZE = 10;
const STRIPE_WIDTH = 3;

function getStripePatternId(color: string) {
	const colorSlug = color.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

	return `${STRIPE_PATTERN_ID_PREFIX}-${colorSlug || "default"}`;
}

function getOrCreateDefinitions(svgElement: SVGSVGElement) {
	const existingDefinitions = svgElement.querySelector("defs");

	if (existingDefinitions) {
		return existingDefinitions;
	}

	const definitions = document.createElementNS(SVG_NAMESPACE, "defs");
	svgElement.prepend(definitions);

	return definitions;
}

function createStripePattern(patternId: string, color: string) {
	const pattern = document.createElementNS(SVG_NAMESPACE, "pattern");
	pattern.setAttribute("id", patternId);
	pattern.setAttribute("width", String(STRIPE_PATTERN_SIZE));
	pattern.setAttribute("height", String(STRIPE_PATTERN_SIZE));
	pattern.setAttribute("patternUnits", "userSpaceOnUse");
	pattern.setAttribute("patternTransform", "rotate(45)");

	const stripe = document.createElementNS(SVG_NAMESPACE, "line");
	stripe.setAttribute("x1", "0");
	stripe.setAttribute("y1", "0");
	stripe.setAttribute("x2", "0");
	stripe.setAttribute("y2", String(STRIPE_PATTERN_SIZE));
	stripe.setAttribute("stroke", color);
	stripe.setAttribute("stroke-width", String(STRIPE_WIDTH));

	pattern.append(stripe);

	return pattern;
}

function ensureStripePattern(svgElement: SVGSVGElement, color: string) {
	const patternId = getStripePatternId(color);

	if (svgElement.querySelector(`#${patternId}`)) {
		return patternId;
	}

	const definitions = getOrCreateDefinitions(svgElement);
	definitions.append(createStripePattern(patternId, color));

	return patternId;
}

function applyPolygonStripeFill(polygon: Leaflet.Polygon, color: string) {
	const polygonElement = polygon.getElement() as SVGElement | undefined;
	const svgElement = polygonElement?.ownerSVGElement;

	if (!polygonElement || !svgElement) {
		return;
	}

	const patternId = ensureStripePattern(svgElement, color);
	polygonElement.setAttribute("fill", `url(#${patternId})`);
}

export { applyPolygonStripeFill };
