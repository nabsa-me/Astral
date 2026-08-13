import { City } from '../../domain/entities/City.js';
import { PointOfInterest } from '../../domain/entities/PointOfInterest.js';
import { PointRepository } from '../../domain/repositories/PointRepository.js';
import cordobaData from '../data/cordoba.json';

const cities = {
  cordoba: cordobaData,
};

export class JsonPointRepository extends PointRepository {
  getCity(cityId) {
    const data = cities[cityId];
    if (!data) return null;
    return new City(data.city);
  }

  findByCity(cityId) {
    const data = cities[cityId];
    if (!data) return [];
    return data.points.map((p) => new PointOfInterest({ ...p, cityId }));
  }
}
