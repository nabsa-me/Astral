import type { LatLngTuple } from 'leaflet';

export interface IDayMapCity {
  cityId: string;
}

export interface IDayMapCoords {
  center: LatLngTuple;
  zoom?: number;
}

export type IDayMap = IDayMapCity | IDayMapCoords;

/** A single planned stop within a day (the planner/itinerary layer). */
export type StopCategory = 'sight' | 'food' | 'transport' | 'stay' | 'nature';

export interface IPlannerStop {
  id: string;
  name: string;
  /** Local time, e.g. "09:30". */
  time?: string;
  note?: string;
  category?: StopCategory;
  /** Links to a point of interest in the city bundle (map + guide). */
  poiId?: string;
  /** Map location for the stop's numbered pin. */
  coords?: LatLngTuple;
  /** Opens a guide (and optional section) when the pin is clicked. */
  guideId?: string;
  sectionId?: string;
  /** Conveys planning progress: a route can be half-done. */
  status?: 'done' | 'planned';
  durationMin?: number;
}

export interface IVacationDay {
  id: string;
  number: number;
  title: string;
  summary?: string;
  paragraphs?: string[];
  /** Ordered itinerary for the day (planner view). */
  stops?: IPlannerStop[];
  map: IDayMap | null;
  /**
   * Ordered waypoints (stops + key intermediate street points from the guide)
   * fed to the routing engine as constraints. The engine must pass through
   * each waypoint in order, so denser waypoints keep the walking route pinned
   * to the streets described in the guide. When absent or empty, only the
   * day's stop coords are used as waypoints.
   */
  routeCoords?: LatLngTuple[];
}

export interface IVacation {
  id: string;
  title: string;
  subtitle?: string;
  days: IVacationDay[];
}

export class Vacation implements IVacation {
  id: string;
  title: string;
  subtitle?: string;
  days: IVacationDay[];

  constructor({ id, title, subtitle, days }: IVacation) {
    this.id = id;
    this.title = title;
    this.subtitle = subtitle;
    this.days = days;
  }
}
