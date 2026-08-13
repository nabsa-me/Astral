import { Route, type IRoute } from '../../domain/entities/Route';
import type { RouteRepository } from '../../domain/repositories/RouteRepository';
import cordobaData from '../data/cordoba.json';

interface CityRoutesFile {
  routes?: Array<Omit<IRoute, 'cityId'>>;
}

const cities: Record<string, CityRoutesFile> = {
  cordoba: cordobaData as unknown as CityRoutesFile,
};

export class JsonRouteRepository implements RouteRepository {
  findByCity(cityId: string): IRoute[] {
    const data = cities[cityId];
    if (!data?.routes) return [];
    return data.routes.map((r) => new Route({ ...r, cityId }));
  }
}
