import type { ISharedRoute } from '../../domain/entities/social/SharedRoute';
import type { SharedRouteRepository } from '../../domain/repositories/social/SharedRouteRepository';

export class GetSharedRouteById {
  constructor(private readonly sharedRouteRepository: SharedRouteRepository) {}

  execute(id: string): ISharedRoute | null {
    return this.sharedRouteRepository.getById(id);
  }
}
