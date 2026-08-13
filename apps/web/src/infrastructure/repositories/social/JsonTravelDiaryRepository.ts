import type { ITravelDiary } from '../../../domain/entities/social/TravelDiary';
import type { TravelDiaryRepository } from '../../../domain/repositories/social/TravelDiaryRepository';
import diariesData from '../../data/social/diaries.json';

const diaries = diariesData as unknown as ITravelDiary[];

export class JsonTravelDiaryRepository implements TravelDiaryRepository {
  findByOwner(ownerId: string): ITravelDiary[] {
    return diaries.filter((diary) => diary.ownerId === ownerId);
  }

  getById(id: string): ITravelDiary | null {
    return diaries.find((diary) => diary.id === id) ?? null;
  }
}
