import type { IRoute } from '../../domain/entities/Route';
import type { RouteRepository } from '../../domain/repositories/RouteRepository';

export class GetRoutesByCity {
  constructor(private readonly routeRepository: RouteRepository) {}

  execute(cityId: string): IRoute[] {
    return this.routeRepository.findByCity(cityId);
  }
}
