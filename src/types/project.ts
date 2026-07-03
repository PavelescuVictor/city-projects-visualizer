export type ProjectStatus = "planning" | "permitting" | "construction" | "delivered";
export type ProjectType = "building" | "park" | "bridge" | "street" | "public-space";

export type LngLat = [number, number];

export interface ParcelPolygon {
  type: "Polygon";
  coordinates: LngLat[][];
}

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface DevelopmentProject {
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

export interface StatusMeta {
  label: string;
  color: string;
  fill: string;
}
