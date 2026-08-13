import type { LatLngTuple } from 'leaflet';
import type { IPlannerStop } from '../../domain/entities/Vacation';

export interface NumberedStop {
  stop: IPlannerStop;
  index: number;
  /** Location number (shared by repeat visits) or null for non-mapped stops. */
  number: number | null;
}

export interface PinLocation {
  number: number;
  coords: LatLngTuple;
  /** First stop at this location — the guide/section is resolved from it. */
  stop: IPlannerStop;
}

const keyOf = ([lat, lng]: LatLngTuple) => `${lat.toFixed(5)},${lng.toFixed(5)}`;

/**
 * Single source of truth so the list badges and the map pins always agree.
 * Numbers identify a *distinct location* (deduped by coordinates): a repeat
 * visit reuses the same number, and a stop without coords gets none.
 */
export function numberStops(stops: IPlannerStop[]): {
  numbered: NumberedStop[];
  pins: PinLocation[];
} {
  const keyToNumber = new Map<string, number>();
  const pins: PinLocation[] = [];
  let next = 1;

  const numbered = stops.map((stop, index) => {
    if (!stop.coords) return { stop, index, number: null };
    const key = keyOf(stop.coords);
    let number = keyToNumber.get(key);
    if (number === undefined) {
      number = next++;
      keyToNumber.set(key, number);
      pins.push({ number, coords: stop.coords, stop });
    }
    return { stop, index, number };
  });

  return { numbered, pins };
}
