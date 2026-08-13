import type { LatLngTuple } from 'leaflet';

export interface IDayMapCity {
  cityId: string;
}

export interface IDayMapCoords {
  center: LatLngTuple;
  zoom?: number;
}

export type IDayMap = IDayMapCity | IDayMapCoords;

export interface IVacationDay {
  id: string;
  number: number;
  title: string;
  summary?: string;
  paragraphs?: string[];
  map: IDayMap | null;
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
