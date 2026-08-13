import { Marker, Tooltip } from 'react-leaflet';
import { pinIcon } from './pinIcon';
import type { IRouteWaypoint } from '../../domain/entities/Route';

interface StopMarkerProps {
  stop: IRouteWaypoint;
  color: string;
  onClick?: (stop: IRouteWaypoint) => void;
}

export default function StopMarker({ stop, color, onClick }: StopMarkerProps) {
  return (
    <Marker
      position={stop.coords}
      icon={pinIcon(color)}
      eventHandlers={onClick ? { click: () => onClick(stop) } : undefined}
    >
      <Tooltip direction="top" offset={[0, -28]} opacity={0.95}>
        <span className="stop-label">{stop.name}</span>
      </Tooltip>
    </Marker>
  );
}
