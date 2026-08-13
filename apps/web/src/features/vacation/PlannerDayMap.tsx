import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Polyline } from 'react-leaflet';
import type { LatLngTuple } from 'leaflet';
import PoiModal from '../map/PoiModal';
import { pinIcon } from '../map/pinIcon';
import { numberStops } from './stopNumbering';
import { MARKER_DEFAULT_COLOR, MARKER_PLANNED_COLOR } from '../../styles/themeColors';
import type { IVacationDay, IPlannerStop } from '../../domain/entities/Vacation';
import type { CityBundle } from '../../app/services';

interface PlannerDayMapProps {
  day: IVacationDay;
  cordoba: CityBundle;
}

/**
 * The day's map, driven by its planner stops: each located stop is a numbered
 * pin that matches its badge in the list, so a stop and its mark share identity.
 */
export default function PlannerDayMap({ day, cordoba }: PlannerDayMapProps) {
  const [openStop, setOpenStop] = useState<IPlannerStop | null>(null);

  const map = day.map;
  const cityMap = map && 'cityId' in map ? map : null;
  const coordsMap = map && 'center' in map ? map : null;
  const isCordoba = cityMap?.cityId === 'cordoba' && Boolean(cordoba.city);

  const { pins } = numberStops(day.stops ?? []);

  let center: LatLngTuple | null = null;
  let zoom = 13;
  if (isCordoba && cordoba.city) {
    center = cordoba.city.center;
    zoom = cordoba.city.zoom;
  } else if (coordsMap) {
    center = coordsMap.center;
    zoom = coordsMap.zoom || 13;
  } else if (pins.length > 0) {
    center = pins[0].coords;
  }
  if (!center) return null;

  const guideIdFor = (stop: IPlannerStop) =>
    stop.poiId ? cordoba.points.find((p) => p.id === stop.poiId)?.guideId : stop.guideId;

  const openGuide = openStop
    ? cordoba.getGuideForPoint({ guideId: guideIdFor(openStop) })
    : null;

  const colorFor = (stop: IPlannerStop) =>
    stop.status === 'planned' ? MARKER_PLANNED_COLOR : MARKER_DEFAULT_COLOR;

  return (
    <div className="map-view">
      <MapContainer center={center} zoom={zoom} className="map-container">
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
        {pins.map(({ number, coords, stop }) => {
          const hasGuide = Boolean(guideIdFor(stop));
          return (
            <Marker
              key={number}
              position={coords}
              icon={pinIcon(colorFor(stop), String(number))}
              eventHandlers={hasGuide ? { click: () => setOpenStop(stop) } : undefined}
            >
              <Tooltip direction="top" offset={[0, -28]} opacity={0.95}>
                <span className="stop-label">
                  {number} · {stop.name}
                </span>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
      {openStop && (
        <PoiModal
          point={{ name: openStop.name }}
          guide={openGuide}
          initialSectionId={openStop.sectionId ?? null}
          onClose={() => setOpenStop(null)}
        />
      )}
    </div>
  );
}
