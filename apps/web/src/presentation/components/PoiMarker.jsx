import { Marker, Tooltip } from 'react-leaflet';
import { pinIcon } from './pinIcon.js';

const DEFAULT_COLOR = '#8c2f23';

export default function PoiMarker({ point, onSelect }) {
  const color = point.color || DEFAULT_COLOR;
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
