import type { LatLngTuple } from 'leaflet';
import type { IPlannerStop, IVacationDay } from '../../domain/entities/Vacation';
import type { CityBundle } from '../../app/services';

/**
 * A stop is placeable on the map if it carries explicit coords or a poiId that
 * resolves to a point in the city bundle.
 */
export function resolveStopCoords(
  stop: IPlannerStop,
  cordoba: CityBundle,
): LatLngTuple | null {
  if (stop.coords) return stop.coords;
  if (stop.poiId) {
    const point = cordoba.points.find((p) => p.id === stop.poiId);
    if (point?.coords) return point.coords;
  }
  return null;
}

/** Mean lat/lng of all located stops in a day. null if no stop is placeable. */
export function dayCentroid(
  day: IVacationDay,
  cordoba: CityBundle,
): LatLngTuple | null {
  const coords = (day.stops ?? [])
    .map((stop) => resolveStopCoords(stop, cordoba))
    .filter((c): c is LatLngTuple => c !== null);
  if (coords.length === 0) return null;
  const lat = coords.reduce((acc, c) => acc + c[0], 0) / coords.length;
  const lng = coords.reduce((acc, c) => acc + c[1], 0) / coords.length;
  return [lat, lng];
}
