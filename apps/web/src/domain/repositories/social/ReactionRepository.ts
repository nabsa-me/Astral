import type { IReaction, ReactionTargetType } from '../../entities/social/Reaction';

export interface ReactionRepository {
  findByTarget(targetType: ReactionTargetType, targetId: string): IReaction[];
}
