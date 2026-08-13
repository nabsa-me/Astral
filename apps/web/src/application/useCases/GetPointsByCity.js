export class GetPointsByCity {
  constructor(pointRepository) {
    this.pointRepository = pointRepository;
  }

  execute(cityId) {
    return this.pointRepository.findByCity(cityId);
  }
}
