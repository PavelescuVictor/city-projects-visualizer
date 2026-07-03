import { Layers, ListFilter, MapPin, Minus } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

interface MapLayerTogglesProps {
  showParcels: boolean;
  showMarkers: boolean;
  onShowParcelsChange: (value: boolean) => void;
  onShowMarkersChange: (value: boolean) => void;
}

export function MapLayerToggles({
  showParcels,
  showMarkers,
  onShowParcelsChange,
  onShowMarkersChange,
}: MapLayerTogglesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedWidth, setExpandedWidth] = useState(120);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const menu = menuRef.current;

    if (!menu) {
      return;
    }

    const updateWidth = () => {
      const menuStyles = window.getComputedStyle(menu);
      const horizontalPadding =
        Number.parseFloat(menuStyles.paddingLeft) + Number.parseFloat(menuStyles.paddingRight);
      const horizontalBorder =
        Number.parseFloat(menuStyles.borderLeftWidth) + Number.parseFloat(menuStyles.borderRightWidth);
      const optionWidths = Array.from(menu.querySelectorAll<HTMLElement>(".map-layer-toggle")).map((toggle) => {
        const toggleStyles = window.getComputedStyle(toggle);
        const toggleBorder =
          Number.parseFloat(toggleStyles.borderLeftWidth) + Number.parseFloat(toggleStyles.borderRightWidth);

        return toggle.scrollWidth + toggleBorder;
      });

      setExpandedWidth(Math.ceil(Math.max(...optionWidths) + horizontalPadding + horizontalBorder));
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(menu);

    return () => observer.disconnect();
  }, []);

  const overlayStyle = {
    "--map-layer-expanded-width": `${expandedWidth}px`,
  } as CSSProperties & { "--map-layer-expanded-width": string };

  return (
    <div
      className={`map-layer-toggles${isExpanded ? " is-expanded" : ""}`}
      style={overlayStyle}
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
      <div className="map-layer-menu" ref={menuRef} aria-hidden={!isExpanded}>
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
