import type { IPointOfInterest } from '../../domain/entities/PointOfInterest';
import type { PointRepository } from '../../domain/repositories/PointRepository';

export class GetPointsByCity {
  constructor(private readonly pointRepository: PointRepository) {}

  execute(cityId: string): IPointOfInterest[] {
    return this.pointRepository.findByCity(cityId);
  }
}
