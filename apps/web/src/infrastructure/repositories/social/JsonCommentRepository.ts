import type { CommentTargetType, IComment } from '../../../domain/entities/social/Comment';
import type { CommentRepository } from '../../../domain/repositories/social/CommentRepository';

/** Read-only stub for this iteration: comments are not persisted yet. */
export class JsonCommentRepository implements CommentRepository {
  findByTarget(_targetType: CommentTargetType, _targetId: string): IComment[] {
    return [];
  }
}
