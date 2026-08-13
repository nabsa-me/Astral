import type { ITravelDiary } from '../../domain/entities/social/TravelDiary';
import type { TravelDiaryRepository } from '../../domain/repositories/social/TravelDiaryRepository';

export class GetDiariesByRoute {
  constructor(private readonly travelDiaryRepository: TravelDiaryRepository) {}

  execute(sharedRouteId: string): ITravelDiary[] {
    return this.travelDiaryRepository.findByRoute(sharedRouteId);
  }
}
