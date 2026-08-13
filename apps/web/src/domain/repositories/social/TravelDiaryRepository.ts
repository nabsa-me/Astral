import type { ITravelDiary } from '../../entities/social/TravelDiary';

export interface TravelDiaryRepository {
  findByOwner(ownerId: string): ITravelDiary[];
  findByRoute(sharedRouteId: string): ITravelDiary[];
  getById(id: string): ITravelDiary | null;
}
