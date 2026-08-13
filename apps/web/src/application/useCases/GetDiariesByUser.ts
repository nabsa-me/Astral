import type { ITravelDiary } from '../../domain/entities/social/TravelDiary';
import type { TravelDiaryRepository } from '../../domain/repositories/social/TravelDiaryRepository';

export class GetDiariesByUser {
  constructor(private readonly travelDiaryRepository: TravelDiaryRepository) {}

  execute(ownerId: string): ITravelDiary[] {
    return this.travelDiaryRepository.findByOwner(ownerId);
  }
}
