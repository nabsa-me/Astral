import type { ICity } from '../entities/City';
import type { IPointOfInterest } from '../entities/PointOfInterest';

export interface PointRepository {
  getCity(cityId: string): ICity | null;
  findByCity(cityId: string): IPointOfInterest[];
}
