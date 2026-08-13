export class GetRoutesByCity {
  constructor(routeRepository) {
    this.routeRepository = routeRepository;
  }

  execute(cityId) {
    return this.routeRepository.findByCity(cityId);
  }
}
