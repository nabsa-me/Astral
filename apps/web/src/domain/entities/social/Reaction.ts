export type ReactionTargetType = 'route' | 'diary' | 'comment';
export type ReactionType = 'like' | 'love' | 'wow';

export interface IReaction {
  id: string;
  targetType: ReactionTargetType;
  targetId: string;
  userId: string;
  type: ReactionType;
  createdAt: string;
}
