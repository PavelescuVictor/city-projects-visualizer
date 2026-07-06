import { Layers, ListFilter, MapPin, Minus } from "lucide-react";
import { useState } from "react";
import "./MapLayerToggles.css";
import type { MapLayerTogglesProps } from "./MapLayerToggles.types";

export function MapLayerToggles({
  showParcels,
  showMarkers,
  onShowParcelsChange,
  onShowMarkersChange,
}: MapLayerTogglesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`map-layer-toggles${isExpanded ? " is-expanded" : ""}`}
      aria-label="Map layer toggles"
    >
      <button
        className="map-layer-filter-button"
        type="button"
        aria-label={isExpanded ? "Collapse map layer filters" : "Show map layer filters"}
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((current) => !current)}
      >
        <ListFilter className="map-layer-button-icon map-layer-button-icon-filter" size={20} aria-hidden="true" />
        <Minus className="map-layer-button-icon map-layer-button-icon-minus" size={18} aria-hidden="true" />
      </button>
      <div className="map-layer-menu" aria-hidden={!isExpanded}>
        <button
          className={`map-layer-toggle${showParcels ? " is-active" : ""}`}
          type="button"
          aria-pressed={showParcels}
          tabIndex={isExpanded ? 0 : -1}
          onClick={() => onShowParcelsChange(!showParcels)}
        >
          <Layers size={16} aria-hidden="true" />
          Parcels
        </button>
        <button
          className={`map-layer-toggle${showMarkers ? " is-active" : ""}`}
          type="button"
          aria-pressed={showMarkers}
          tabIndex={isExpanded ? 0 : -1}
          onClick={() => onShowMarkersChange(!showMarkers)}
        >
          <MapPin size={16} aria-hidden="true" />
          Markers
        </button>
      </div>
    </div>
  );
}
