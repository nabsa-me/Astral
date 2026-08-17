import type { LatLngTuple } from 'leaflet';

/**
 * Requests a walking route through the given waypoints from OSRM's public demo
 * server (foot profile) and returns the road geometry as [lat, lng] tuples.
 * Falls back to null on any failure — callers should render the straight line
 * meanwhile. Results are cached by waypoint hash.
 *
 * The demo server is rate-limited; production should self-host OSRM or use
 * OpenRouteService with an API key.
 */
const cache = new Map<string, LatLngTuple[]>();
const inFlight = new Map<string, Promise<LatLngTuple[] | null>>();

const keyFor = (coords: LatLngTuple[]) =>
  coords.map(([lat, lng]) => `${lat.toFixed(5)},${lng.toFixed(5)}`).join(';');

export async function fetchRoute(coords: LatLngTuple[]): Promise<LatLngTuple[] | null> {
  if (coords.length < 2) return null;
  const key = keyFor(coords);
  const cached = cache.get(key);
  if (cached) return cached;
  const pending = inFlight.get(key);
  if (pending) return pending;

  const path = coords.map(([lat, lng]) => `${lng},${lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/foot/${path}?overview=full&geometries=geojson`;

  const promise = (async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      const data = await response.json();
      const geometry = data?.routes?.[0]?.geometry?.coordinates;
      if (!Array.isArray(geometry) || geometry.length === 0) return null;
      const line: LatLngTuple[] = geometry.map(([lng, lat]: [number, number]) => [lat, lng]);
      cache.set(key, line);
      return line;
    } catch {
      return null;
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, promise);
  return promise;
}
