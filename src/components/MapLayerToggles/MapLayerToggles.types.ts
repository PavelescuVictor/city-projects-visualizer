export interface MapLayerTogglesProps {
  showParcels: boolean;
  showMarkers: boolean;
  onShowParcelsChange: (value: boolean) => void;
  onShowMarkersChange: (value: boolean) => void;
}
