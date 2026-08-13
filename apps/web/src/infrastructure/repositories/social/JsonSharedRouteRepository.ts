import type { ISharedRoute } from '../../../domain/entities/social/SharedRoute';
import type { SharedRouteRepository } from '../../../domain/repositories/social/SharedRouteRepository';
import sharedRoutesData from '../../data/social/sharedRoutes.json';

const sharedRoutes = sharedRoutesData as unknown as ISharedRoute[];

const byNewest = (a: ISharedRoute, b: ISharedRoute): number =>
  b.createdAt.localeCompare(a.createdAt);

export class JsonSharedRouteRepository implements SharedRouteRepository {
  getFeed(): ISharedRoute[] {
    return sharedRoutes.filter((route) => route.visibility === 'public').sort(byNewest);
  }

  findByOwner(ownerId: string): ISharedRoute[] {
    return sharedRoutes.filter((route) => route.ownerId === ownerId).sort(byNewest);
  }

  getById(id: string): ISharedRoute | null {
    return sharedRoutes.find((route) => route.id === id) ?? null;
  }
}
