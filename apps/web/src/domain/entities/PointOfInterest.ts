import type { LatLngTuple } from 'leaflet';

export interface IPointOfInterest {
  id: string;
  cityId: string;
  name: string;
  coords: LatLngTuple;
  guideId?: string;
  color?: string;
}

export class PointOfInterest implements IPointOfInterest {
  id: string;
  cityId: string;
  name: string;
  coords: LatLngTuple;
  guideId?: string;
  color?: string;

  constructor({ id, cityId, name, coords, guideId, color }: IPointOfInterest) {
    this.id = id;
    this.cityId = cityId;
    this.name = name;
    this.coords = coords;
    this.guideId = guideId;
    this.color = color;
  }
}
