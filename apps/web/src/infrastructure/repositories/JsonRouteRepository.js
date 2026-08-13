import { Route } from '../../domain/entities/Route.js';
import { RouteRepository } from '../../domain/repositories/RouteRepository.js';
import cordobaData from '../data/cordoba.json';

const cities = {
  cordoba: cordobaData,
};

export class JsonRouteRepository extends RouteRepository {
  findByCity(cityId) {
    const data = cities[cityId];
    if (!data?.routes) return [];
    return data.routes.map((r) => new Route({ ...r, cityId }));
  }
}
