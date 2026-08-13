import type { IReaction, ReactionTargetType } from '../../../domain/entities/social/Reaction';
import type { ReactionRepository } from '../../../domain/repositories/social/ReactionRepository';

/** Read-only stub for this iteration: reactions are not persisted yet. */
export class JsonReactionRepository implements ReactionRepository {
  findByTarget(_targetType: ReactionTargetType, _targetId: string): IReaction[] {
    return [];
  }
}
