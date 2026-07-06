export interface MapFilterTogglesProps {
  showParcels: boolean;
  showMarkers: boolean;
  onShowParcelsChange: (value: boolean) => void;
  onShowMarkersChange: (value: boolean) => void;
}
