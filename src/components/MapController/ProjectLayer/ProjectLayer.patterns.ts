import type Leaflet from "leaflet";
import type { ProjectType } from "../../../data/projects.types";
import parcelStripePatternTemplate from "./parcelStripePattern.svg?raw";

interface ParcelStripePatternStyle {
	color: string;
	fill: string;
}

function parcelStripePatternId(type: ProjectType) {
	return `parcel-stripes-${type}`;
}

function parcelStripePatternFill(type: ProjectType) {
	return `url(#${parcelStripePatternId(type)})`;
}

function replaceTemplateValue(template: string, key: string, value: string) {
	return template.split(key).join(value);
}

function ensureParcelStripePattern(map: Leaflet.Map, type: ProjectType, layerStyle: ParcelStripePatternStyle) {
	const svg = map.getPanes().overlayPane.querySelector<SVGSVGElement>("svg");
	const patternId = parcelStripePatternId(type);

	if (!svg || svg.querySelector(`#${patternId}`)) {
		return;
	}

	let defs = svg.querySelector("defs");

	if (!defs) {
		defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
		svg.insertBefore(defs, svg.firstChild);
	}

	const patternMarkup = replaceTemplateValue(
		replaceTemplateValue(
			replaceTemplateValue(parcelStripePatternTemplate, "__PATTERN_ID__", patternId),
			"__PATTERN_FILL__",
			layerStyle.fill,
		),
		"__PATTERN_COLOR__",
		layerStyle.color,
	);
	const patternDocument = new DOMParser().parseFromString(patternMarkup, "image/svg+xml");
	const pattern = patternDocument.querySelector("pattern");

	if (!pattern) {
		return;
	}

	defs.append(document.importNode(pattern, true));
}

export { ensureParcelStripePattern, parcelStripePatternFill };
