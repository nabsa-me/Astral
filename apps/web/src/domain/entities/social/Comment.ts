export type CommentTargetType = 'route' | 'diary';

export interface IComment {
  id: string;
  targetType: CommentTargetType;
  targetId: string;
  userId: string;
  body: string;
  parentId?: string;
  createdAt: string;
}
