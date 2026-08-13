export class PointRepository {
  getCity(_cityId) {
    throw new Error('PointRepository.getCity must be implemented');
  }

  findByCity(_cityId) {
    throw new Error('PointRepository.findByCity must be implemented');
  }
}
