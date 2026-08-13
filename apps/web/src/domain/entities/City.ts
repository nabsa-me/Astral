import type { LatLngTuple } from 'leaflet';

export interface ICity {
  id: string;
  name: string;
  center: LatLngTuple;
  zoom: number;
}

export class City implements ICity {
  id: string;
  name: string;
  center: LatLngTuple;
  zoom: number;

  constructor({ id, name, center, zoom }: ICity) {
    this.id = id;
    this.name = name;
    this.center = center;
    this.zoom = zoom;
  }
}
