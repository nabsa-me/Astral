import { City, type ICity } from '../../domain/entities/City';
import { PointOfInterest, type IPointOfInterest } from '../../domain/entities/PointOfInterest';
import type { IRoute } from '../../domain/entities/Route';
import type { PointRepository } from '../../domain/repositories/PointRepository';
import cordobaData from '../data/cordoba.json';

interface CityFile {
  city: ICity;
  points: Array<Omit<IPointOfInterest, 'cityId'>>;
  routes: Array<Omit<IRoute, 'cityId'>>;
}

const cities: Record<string, CityFile> = {
  cordoba: cordobaData as unknown as CityFile,
};

export class JsonPointRepository implements PointRepository {
  getCity(cityId: string): ICity | null {
    const data = cities[cityId];
    if (!data) return null;
    return new City(data.city);
  }

  findByCity(cityId: string): IPointOfInterest[] {
    const data = cities[cityId];
    if (!data) return [];
    return data.points.map((p) => new PointOfInterest({ ...p, cityId }));
  }
}
