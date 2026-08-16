import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Polyline, useMap } from 'react-leaflet';
import type { LatLngTuple } from 'leaflet';
import { pinIcon } from '../map/pinIcon';
import { CATEGORY_GLYPH } from './stopCategory';
import {
  MARKER_DEFAULT_COLOR,
  MARKER_PLANNED_COLOR,
  MARKER_SELECTED_COLOR,
} from '../../styles/themeColors';
import type { IVacationDay, IPlannerStop } from '../../domain/entities/Vacation';
import type { CityBundle } from '../../app/services';

interface PlannerDayMapProps {
  day: IVacationDay;
  cordoba: CityBundle;
  /** True when a stop has a guide the caller can open. */
  hasGuide: (stop: IPlannerStop) => boolean;
  onOpenStop: (stop: IPlannerStop) => void;
  /** Stop the user selected in the timeline; the map pans to it and highlights the pin. */
  selectedStopId: string | null;
}

/** Pans the map to the selected stop whenever the selection changes. */
function MapCenterOnSelection({ coords }: { coords: LatLngTuple | null }) {
  const map = useMap();
  useEffect(() => {
    if (!coords) return;
    map.flyTo(coords, Math.max(map.getZoom(), 15), { duration: 0.6 });
  }, [coords, map]);
  return null;
}

/**
 * The day's map, driven by its planner stops: each located stop is a pin whose
 * icon matches its category badge in the list, so a stop and its mark share
 * identity by category rather than by number.
 */
export default function PlannerDayMap({
  day,
  cordoba,
  hasGuide,
  onOpenStop,
  selectedStopId,
}: PlannerDayMapProps) {
  const map = day.map;
  const cityMap = map && 'cityId' in map ? map : null;
  const coordsMap = map && 'center' in map ? map : null;
  const isCordoba = cityMap?.cityId === 'cordoba' && Boolean(cordoba.city);

  const stopsWithCoords = (day.stops ?? []).filter(
    (s): s is IPlannerStop & { coords: LatLngTuple } => Boolean(s.coords),
  );

  let center: LatLngTuple | null = null;
  let zoom = 13;
  if (isCordoba && cordoba.city) {
    center = cordoba.city.center;
    zoom = cordoba.city.zoom;
  } else if (coordsMap) {
    center = coordsMap.center;
    zoom = coordsMap.zoom || 13;
  } else if (stopsWithCoords.length > 0) {
    center = stopsWithCoords[0].coords;
  }
  if (!center) return null;

  const colorFor = (stop: IPlannerStop) => {
    if (stop.id === selectedStopId) return MARKER_SELECTED_COLOR;
    return stop.status === 'planned' ? MARKER_PLANNED_COLOR : MARKER_DEFAULT_COLOR;
  };

  const selectedCoords =
    stopsWithCoords.find((s) => s.id === selectedStopId)?.coords ?? null;

  return (
    <div className="map-view">
      <MapContainer center={center} zoom={zoom} className="map-container">
        <MapCenterOnSelection coords={selectedCoords} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {isCordoba
          ? cordoba.routes.map((route) => (
              <Polyline
                key={route.id}
                positions={route.coords}
                pathOptions={{
                  color: route.color,
                  weight: 5,
                  opacity: 0.85,
                  dashArray: '2 8',
                  lineCap: 'round',
                }}
              />
            ))
          : null}
        {stopsWithCoords.map((stop) => {
          const glyph = stop.category ? CATEGORY_GLYPH[stop.category] : undefined;
          const clickable = hasGuide(stop);
          return (
            <Marker
              key={stop.id}
              position={stop.coords}
              icon={pinIcon(colorFor(stop), glyph)}
              eventHandlers={clickable ? { click: () => onOpenStop(stop) } : undefined}
            >
              <Tooltip direction="top" offset={[0, -28]} opacity={0.95}>
                <span className="stop-label">{stop.name}</span>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
