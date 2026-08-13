import type { LatLngTuple } from 'leaflet';

export interface IRouteWaypoint {
  name: string;
  coords: LatLngTuple;
  stop?: boolean;
  sectionId?: string;
}

export interface IRoute {
  id: string;
  cityId: string;
  name: string;
  description: string;
  from?: string;
  to?: string;
  coords: LatLngTuple[];
  color: string;
  waypoints: IRouteWaypoint[];
  guideId?: string;
}

type RouteInput = Omit<IRoute, 'waypoints'> & { waypoints?: IRouteWaypoint[] };

export class Route implements IRoute {
  id: string;
  cityId: string;
  name: string;
  description: string;
  from?: string;
  to?: string;
  coords: LatLngTuple[];
  color: string;
  waypoints: IRouteWaypoint[];
  guideId?: string;

  constructor({
    id,
    cityId,
    name,
    description,
    from,
    to,
    coords,
    color,
    waypoints,
    guideId,
  }: RouteInput) {
    this.id = id;
    this.cityId = cityId;
    this.name = name;
    this.description = description;
    this.from = from;
    this.to = to;
    this.coords = coords;
    this.color = color;
    this.waypoints = waypoints || [];
    this.guideId = guideId;
  }
}
