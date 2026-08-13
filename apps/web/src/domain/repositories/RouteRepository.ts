import type { IRoute } from '../entities/Route';

export interface RouteRepository {
  findByCity(cityId: string): IRoute[];
}
