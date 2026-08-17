import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap, useMapEvent } from 'react-leaflet';
import type { LatLngBoundsExpression, LatLngTuple } from 'leaflet';
import { pinIcon } from '../map/pinIcon';
import {
  MARKER_DEFAULT_COLOR,
  MARKER_PLANNED_COLOR,
  MARKER_SELECTED_COLOR,
} from '../../styles/themeColors';
import { CATEGORY_GLYPH } from './stopCategory';
import { dayCentroid, resolveStopCoords } from './stopCoords';
import type { IPlannerStop, IVacationDay } from '../../domain/entities/Vacation';
import type { CityBundle } from '../../app/services';

interface TripMapProps {
  days: IVacationDay[];
  cordoba: CityBundle;
  activeDayId: string | null;
  selectedStopId: string | null;
  onSelectDay: (dayId: string) => void;
  onSelectStop: (stop: IPlannerStop, dayId: string) => void;
  onOpenStop: (stop: IPlannerStop, dayId: string) => void;
  hasGuide: (stop: IPlannerStop) => boolean;
}

interface LocatedStop {
  day: IVacationDay;
  stop: IPlannerStop;
  coords: LatLngTuple;
  isDayLead: boolean;
}

interface DayAggregate {
  day: IVacationDay;
  centroid: LatLngTuple;
  stopCount: number;
}

/** Threshold at which we switch from aggregated day markers to individual stops. */
const LOD_ZOOM_THRESHOLD = 13;

/** Fits map bounds to the active day (or all when null) whenever active changes. */
function BoundsController({
  located,
  activeDayId,
}: {
  located: LocatedStop[];
  activeDayId: string | null;
}) {
  const map = useMap();
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    const all = located.map((entry) => entry.coords);
    if (all.length === 0) return;
    map.fitBounds(all as LatLngBoundsExpression, { padding: [40, 40] });
    didInit.current = true;
  }, [located, map]);

  useEffect(() => {
    if (!didInit.current) return;
    if (activeDayId === null) {
      const all = located.map((entry) => entry.coords);
      if (all.length === 0) return;
      map.flyToBounds(all as LatLngBoundsExpression, {
        padding: [40, 40],
        duration: 0.7,
      });
      return;
    }
    const dayCoords = located
      .filter((entry) => entry.day.id === activeDayId)
      .map((entry) => entry.coords);
    if (dayCoords.length === 0) return;
    if (dayCoords.length === 1) {
      map.flyTo(dayCoords[0], Math.max(map.getZoom(), 14), { duration: 0.7 });
    } else {
      map.flyToBounds(dayCoords as LatLngBoundsExpression, {
        padding: [80, 80],
        maxZoom: 15,
        duration: 0.7,
      });
    }
  }, [activeDayId, located, map]);

  return null;
}

/** Subscribes to zoom changes and reports the current zoom to the parent. */
function ZoomWatcher({ onZoom }: { onZoom: (zoom: number) => void }) {
  const map = useMap();
  useEffect(() => {
    onZoom(map.getZoom());
  }, [map, onZoom]);
  useMapEvent('zoomend', () => onZoom(map.getZoom()));
  return null;
}

/** Flies to the currently selected stop with an evident zoom-in. */
function SelectionController({
  coords,
}: {
  coords: LatLngTuple | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (!coords) return;
    map.flyTo(coords, 17, { duration: 0.7 });
  }, [coords, map]);
  return null;
}

export default function TripOverviewMap({
  days,
  cordoba,
  activeDayId,
  selectedStopId,
  onSelectDay,
  onSelectStop,
  onOpenStop,
  hasGuide,
}: TripMapProps) {
  const [zoom, setZoom] = useState<number>(cordoba.city?.zoom ?? 12);

  const located = useMemo<LocatedStop[]>(() => {
    const entries: LocatedStop[] = [];
    days.forEach((day) => {
      let leadTaken = false;
      (day.stops ?? []).forEach((stop) => {
        const coords = resolveStopCoords(stop, cordoba);
        if (!coords) return;
        entries.push({ day, stop, coords, isDayLead: !leadTaken });
        leadTaken = true;
      });
    });
    return entries;
  }, [days, cordoba]);

  const aggregates = useMemo<DayAggregate[]>(
    () =>
      days
        .map((day) => {
          const centroid = dayCentroid(day, cordoba);
          if (!centroid) return null;
          const stopCount = (day.stops ?? []).filter((stop) => resolveStopCoords(stop, cordoba))
            .length;
          return { day, centroid, stopCount };
        })
        .filter((agg): agg is DayAggregate => agg !== null),
    [days, cordoba],
  );

  if (located.length === 0) return null;

  const initialCenter: LatLngTuple = cordoba.city?.center ?? located[0].coords;
  const initialZoom = cordoba.city?.zoom ?? 12;
  const showAggregates = zoom < LOD_ZOOM_THRESHOLD;
  const selectedCoords =
    selectedStopId !== null
      ? located.find((entry) => entry.stop.id === selectedStopId)?.coords ?? null
      : null;

  return (
    <div className="trip-map">
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <BoundsController located={located} activeDayId={activeDayId} />
        <ZoomWatcher onZoom={setZoom} />
        <SelectionController coords={selectedCoords} />

        {showAggregates && aggregates.length >= 2 ? (
          <Polyline
            positions={aggregates.map((a) => a.centroid)}
            pathOptions={{
              color: MARKER_SELECTED_COLOR,
              weight: 4,
              opacity: 0.9,
              lineCap: 'round',
            }}
          />
        ) : null}

        {showAggregates
          ? aggregates.map(({ day, centroid, stopCount }) => {
              const isActive = day.id === activeDayId;
              const color = isActive ? MARKER_SELECTED_COLOR : MARKER_DEFAULT_COLOR;
              return (
                <Marker
                  key={`agg-${day.id}`}
                  position={centroid}
                  icon={pinIcon(color, undefined, `D${day.number}`)}
                  zIndexOffset={isActive ? 700 : 400}
                  eventHandlers={{
                    click: () => onSelectDay(day.id),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -28]} opacity={0.95}>
                    <span className="stop-label">
                      Día {day.number} · {stopCount} paradas
                    </span>
                  </Tooltip>
                </Marker>
              );
            })
          : located.map((entry) => {
              const { day, stop, coords } = entry;
              const isSelected = stop.id === selectedStopId;
              const isActive = activeDayId !== null && day.id === activeDayId;
              const dimmed = activeDayId !== null && !isActive && !isSelected;
              const clickable = hasGuide(stop);
              const baseColor = isSelected
                ? MARKER_SELECTED_COLOR
                : stop.status === 'planned'
                  ? MARKER_PLANNED_COLOR
                  : MARKER_DEFAULT_COLOR;
              const glyph = stop.category ? CATEGORY_GLYPH[stop.category] : undefined;
              const opacity = dimmed ? 0.4 : stop.status === 'planned' && !isSelected ? 0.75 : 1;
              const icon = pinIcon(baseColor, glyph);
              const zIndex = isSelected ? 1000 : isActive ? 500 : 0;
              return (
                <Marker
                  key={stop.id}
                  position={coords}
                  icon={icon}
                  opacity={opacity}
                  zIndexOffset={zIndex}
                  eventHandlers={{
                    click: () => {
                      onSelectStop(stop, day.id);
                      if (clickable) onOpenStop(stop, day.id);
                    },
                  }}
                >
                  <Tooltip direction="top" offset={[0, -28]} opacity={0.95}>
                    <span className="stop-label">
                      Día {day.number} · {stop.name}
                    </span>
                  </Tooltip>
                </Marker>
              );
            })}
      </MapContainer>
    </div>
  );
}
