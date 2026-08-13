import type { ISharedRoute } from '../../domain/entities/social/SharedRoute';
import type { SharedRouteRepository } from '../../domain/repositories/social/SharedRouteRepository';

export class GetFeed {
  constructor(private readonly sharedRouteRepository: SharedRouteRepository) {}

  execute(): ISharedRoute[] {
    return this.sharedRouteRepository.getFeed();
  }
}
