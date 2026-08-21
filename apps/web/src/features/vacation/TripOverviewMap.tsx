import { useEffect, useMemo, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import type { LatLngBoundsExpression, LatLngTuple } from 'leaflet';
import { pinIcon } from '../map/pinIcon';
import {
  MARKER_DEFAULT_COLOR,
  MARKER_PLANNED_COLOR,
  MARKER_SELECTED_COLOR,
} from '../../styles/themeColors';
import { CATEGORY_GLYPH } from './stopCategory';
import { resolveStopCoords } from './stopCoords';
import type { IMapPoi, IPlannerStop, IVacationDay } from '../../domain/entities/Vacation';
import type { CityBundle } from '../../app/services';

interface TripMapProps {
  days: IVacationDay[];
  cordoba: CityBundle;
  activeDayId: string | null;
  selectedStopId: string | null;
  selectedPoiId: string | null;
  onSelectDay: (dayId: string | null) => void;
  onSelectStop: (stop: IPlannerStop, dayId: string) => void;
  onOpenStop: (stop: IPlannerStop, dayId: string) => void;
  onOpenPoi: (poi: IMapPoi, dayId: string) => void;
  hasGuide: (stop: IPlannerStop) => boolean;
}

const ZOOM_OVERVIEW_THRESHOLD = 11;
const PROGRAMMATIC_ZOOM_WINDOW_MS = 1200;

interface LocatedStop {
  day: IVacationDay;
  stop: IPlannerStop;
  coords: LatLngTuple;
}

interface LocatedPoi {
  day: IVacationDay;
  poi: IMapPoi;
  coords: LatLngTuple;
}

const SAME_AREA_KM = 25;

function haversineKm(a: LatLngTuple, b: LatLngTuple): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Fits map bounds to the active day (or the overview set when null). */
function BoundsController({
  located,
  overview,
  activeDayId,
  programmaticRef,
  skipNextFitRef,
}: {
  located: LocatedStop[];
  overview: LocatedStop[];
  activeDayId: string | null;
  programmaticRef: React.MutableRefObject<number>;
  skipNextFitRef: React.MutableRefObject<boolean>;
}) {
  const map = useMap();
  const didInit = useRef(false);

  const markProgrammatic = () => {
    programmaticRef.current = Date.now() + PROGRAMMATIC_ZOOM_WINDOW_MS;
  };

  useEffect(() => {
    if (didInit.current) return;
    const all = overview.map((entry) => entry.coords);
    if (all.length === 0) return;
    markProgrammatic();
    map.fitBounds(all as LatLngBoundsExpression, { padding: [40, 40] });
    didInit.current = true;
  }, [overview, map]);

  useEffect(() => {
    if (!didInit.current) return;
    if (skipNextFitRef.current) {
      skipNextFitRef.current = false;
      return;
    }
    if (activeDayId === null) {
      const all = overview.map((entry) => entry.coords);
      if (all.length === 0) return;
      markProgrammatic();
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
    markProgrammatic();
    if (dayCoords.length === 1) {
      map.flyTo(dayCoords[0], Math.max(map.getZoom(), 14), { duration: 0.7 });
    } else {
      map.flyToBounds(dayCoords as LatLngBoundsExpression, {
        padding: [80, 80],
        maxZoom: 15,
        duration: 0.7,
      });
    }
  }, [activeDayId, located, overview, map]);

  return null;
}

/** Flies to the currently selected stop with an evident zoom-in. */
function SelectionController({
  coords,
  programmaticRef,
}: {
  coords: LatLngTuple | null;
  programmaticRef: React.MutableRefObject<number>;
}) {
  const map = useMap();
  useEffect(() => {
    if (!coords) return;
    programmaticRef.current = Date.now() + PROGRAMMATIC_ZOOM_WINDOW_MS;
    map.flyTo(coords, 17, { duration: 0.7 });
  }, [coords, map, programmaticRef]);
  return null;
}

function ResizeInvalidator() {
  const map = useMap();
  useEffect(() => {
    const invalidate = () => map.invalidateSize();
    window.addEventListener('resize', invalidate);
    window.addEventListener('orientationchange', invalidate);
    const container = map.getContainer();
    const observer = new ResizeObserver(invalidate);
    observer.observe(container);
    return () => {
      window.removeEventListener('resize', invalidate);
      window.removeEventListener('orientationchange', invalidate);
      observer.disconnect();
    };
  }, [map]);
  return null;
}

/** Tracks user-driven zoom: switches to overview or to nearest day. */
function ZoomController({
  located,
  onSelectDay,
  programmaticRef,
  skipNextFitRef,
  activeDayId,
}: {
  located: LocatedStop[];
  onSelectDay: (dayId: string | null) => void;
  programmaticRef: React.MutableRefObject<number>;
  skipNextFitRef: React.MutableRefObject<boolean>;
  activeDayId: string | null;
}) {
  const map = useMapEvents({
    zoomend() {
      if (Date.now() < programmaticRef.current) return;
      const zoom = map.getZoom();
      if (zoom < ZOOM_OVERVIEW_THRESHOLD) {
        if (activeDayId === null) return;
        skipNextFitRef.current = true;
        onSelectDay(null);
        return;
      }
      if (located.length === 0) return;
      const center = map.getCenter();
      const centerTuple: LatLngTuple = [center.lat, center.lng];
      let bestDay: string | null = null;
      let bestDist = Infinity;
      located.forEach(({ day, coords }) => {
        const dist = haversineKm(centerTuple, coords);
        if (dist < bestDist) {
          bestDist = dist;
          bestDay = day.id;
        }
      });
      if (bestDay === null || bestDay === activeDayId) return;
      skipNextFitRef.current = true;
      onSelectDay(bestDay);
    },
  });
  return null;
}

export default function TripOverviewMap({
  days,
  cordoba,
  activeDayId,
  selectedStopId,
  selectedPoiId,
  onSelectDay,
  onSelectStop,
  onOpenStop,
  onOpenPoi,
  hasGuide,
}: TripMapProps) {
  const located = useMemo<LocatedStop[]>(() => {
    const entries: LocatedStop[] = [];
    days.forEach((day) => {
      (day.stops ?? []).forEach((stop) => {
        if (stop.category === 'food') return;
        const coords = resolveStopCoords(stop, cordoba);
        if (!coords) return;
        entries.push({ day, stop, coords });
      });
    });
    return entries;
  }, [days, cordoba]);

  const overviewLeads = useMemo<LocatedStop[]>(() => {
    const leads: LocatedStop[] = [];
    days.forEach((day) => {
      const clusters: { anchor: LatLngTuple; members: LocatedStop[] }[] = [];
      (day.stops ?? []).forEach((stop) => {
        if (stop.hideOnOverview) return;
        if (stop.category === 'food') return;
        const coords = resolveStopCoords(stop, cordoba);
        if (!coords) return;
        const entry: LocatedStop = { day, stop, coords };
        const match = clusters.find(
          (c) => haversineKm(c.anchor, coords) <= SAME_AREA_KM,
        );
        if (match) match.members.push(entry);
        else clusters.push({ anchor: coords, members: [entry] });
      });
      clusters.forEach((cluster, idx) => {
        const preferred = cluster.members.find(
          (m) => m.stop.category !== 'stay' && m.stop.category !== 'transport',
        );
        if (preferred) {
          leads.push(preferred);
          return;
        }
        const isLast = idx === clusters.length - 1;
        if (isLast) leads.push(cluster.members[0]);
      });
    });
    return leads;
  }, [days, cordoba]);

  const locatedPois = useMemo<LocatedPoi[]>(() => {
    const entries: LocatedPoi[] = [];
    days.forEach((day) => {
      (day.mapPois ?? []).forEach((poi) => {
        if (poi.category === 'food') return;
        entries.push({ day, poi, coords: poi.coords });
      });
    });
    return entries;
  }, [days]);

  const programmaticRef = useRef<number>(0);
  const skipNextFitRef = useRef<boolean>(false);

  if (located.length === 0) return null;

  const isOverview = activeDayId === null;
  const stopMarkers = isOverview ? overviewLeads : located;

  const initialCenter: LatLngTuple = cordoba.city?.center ?? located[0].coords;
  const initialZoom = cordoba.city?.zoom ?? 12;
  const selectedCoords =
    selectedStopId !== null
      ? located.find((entry) => entry.stop.id === selectedStopId)?.coords ?? null
      : selectedPoiId !== null
        ? locatedPois.find((entry) => entry.poi.id === selectedPoiId)?.coords ?? null
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
        <ResizeInvalidator />
        <BoundsController
          located={located}
          overview={overviewLeads}
          activeDayId={activeDayId}
          programmaticRef={programmaticRef}
          skipNextFitRef={skipNextFitRef}
        />
        <SelectionController
          coords={selectedCoords}
          programmaticRef={programmaticRef}
        />
        <ZoomController
          located={located}
          onSelectDay={onSelectDay}
          programmaticRef={programmaticRef}
          skipNextFitRef={skipNextFitRef}
          activeDayId={activeDayId}
        />

        {isOverview && stopMarkers.length >= 2 ? (
          <Polyline
            positions={stopMarkers.map((entry) => entry.coords)}
            pathOptions={{
              color: MARKER_SELECTED_COLOR,
              weight: 4,
              opacity: 0.9,
              lineCap: 'round',
            }}
          />
        ) : null}

        {stopMarkers
          .map((entry) => {
            const { day, stop, coords } = entry;
            const isSelected = stop.id === selectedStopId;
            const isActive = activeDayId !== null && day.id === activeDayId;
            const clickable = hasGuide(stop);
            const baseColor = isSelected ? MARKER_SELECTED_COLOR : MARKER_DEFAULT_COLOR;
            const glyph = stop.category ? CATEGORY_GLYPH[stop.category] : undefined;
            const opacity = 1;
            const icon = isOverview
              ? pinIcon(baseColor, undefined, String(day.number))
              : pinIcon(baseColor, glyph);
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
                    if (isOverview) {
                      onSelectDay(day.id);
                    } else if (isSelected && clickable) {
                      onOpenStop(stop, day.id);
                    } else {
                      onSelectStop(stop, day.id);
                    }
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

        {isOverview
          ? null
          : locatedPois.map(({ day, poi, coords }) => {
            const isActive = activeDayId !== null && day.id === activeDayId;
            const isSelected = poi.id === selectedPoiId;
            const glyph = poi.category ? CATEGORY_GLYPH[poi.category] : undefined;
            const baseColor = isSelected ? MARKER_SELECTED_COLOR : MARKER_DEFAULT_COLOR;
            const icon = pinIcon(baseColor, glyph);
            const zIndex = isSelected ? 1000 : isActive ? 200 : 0;
            return (
              <Marker
                key={`poi-${poi.id}`}
                position={coords}
                icon={icon}
                opacity={1}
                zIndexOffset={zIndex}
                eventHandlers={{
                  click: () => onOpenPoi(poi, day.id),
                }}
              >
                <Tooltip direction="top" offset={[0, -28]} opacity={0.95}>
                  <span className="stop-label">
                    Día {day.number} · {poi.name}
                  </span>
                </Tooltip>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}
