export type ProjectStatus = "planning" | "permitting" | "construction" | "delivered";
export type ProjectType = "building" | "park" | "transport-infrastructure" | "public-space";

export interface ProjectImage {
	src: string;
	alt: string;
}

export type LngLat = [number, number];

export interface ParcelPolygon {
	type: "Polygon";
	coordinates: LngLat[][];
}

export interface Project {
	id: string;
	name: string;
	type: ProjectType;
	status: ProjectStatus;
	address: string;
	neighbourhood: string;
	websiteUrl: string;
	images: ProjectImage[];
	coordinates: LngLat;
	parcelPolygon: ParcelPolygon;
}

export interface CreateProjectDraft {
	name: string;
	address: string;
	neighbourhood: string;
	websiteUrl: string;
	coordinates: LngLat;
	parcelPolygon: ParcelPolygon;
}
