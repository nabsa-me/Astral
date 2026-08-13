import { Marker, Tooltip } from 'react-leaflet';
import { pinIcon } from './pinIcon';
import { MARKER_DEFAULT_COLOR } from '../../styles/themeColors';
import type { IPointOfInterest } from '../../domain/entities/PointOfInterest';

interface PoiMarkerProps {
  point: IPointOfInterest;
  onSelect: (point: IPointOfInterest) => void;
}

export default function PoiMarker({ point, onSelect }: PoiMarkerProps) {
  const color = point.color || MARKER_DEFAULT_COLOR;
  return (
    <Marker
      position={point.coords}
      icon={pinIcon(color)}
      eventHandlers={{ click: () => onSelect(point) }}
    >
      <Tooltip direction="top" offset={[0, -28]} opacity={0.95}>
        <span className="stop-label">{point.name}</span>
      </Tooltip>
    </Marker>
  );
}
