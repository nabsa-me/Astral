import type { ITravelDiary } from '../../domain/entities/social/TravelDiary';
import type { TravelDiaryRepository } from '../../domain/repositories/social/TravelDiaryRepository';

export class GetDiaryById {
  constructor(private readonly travelDiaryRepository: TravelDiaryRepository) {}

  execute(id: string): ITravelDiary | null {
    return this.travelDiaryRepository.getById(id);
  }
}
