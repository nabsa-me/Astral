import type { ISharedRoute } from '../../domain/entities/social/SharedRoute';
import type { SharedRouteRepository } from '../../domain/repositories/social/SharedRouteRepository';

export class GetRoutesByUser {
  constructor(private readonly sharedRouteRepository: SharedRouteRepository) {}

  execute(ownerId: string): ISharedRoute[] {
    return this.sharedRouteRepository.findByOwner(ownerId);
  }
}
