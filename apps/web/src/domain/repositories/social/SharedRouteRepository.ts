import type { ISharedRoute } from '../../entities/social/SharedRoute';

export interface SharedRouteRepository {
  getFeed(): ISharedRoute[];
  findByOwner(ownerId: string): ISharedRoute[];
  getById(id: string): ISharedRoute | null;
}
