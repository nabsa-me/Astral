import type { CommentTargetType, IComment } from '../../entities/social/Comment';

export interface CommentRepository {
  findByTarget(targetType: CommentTargetType, targetId: string): IComment[];
}
