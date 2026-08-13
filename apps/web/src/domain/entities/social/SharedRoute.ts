export type RouteVisibility = 'public' | 'friends' | 'private';

export interface ISharedRouteStats {
  likes: number;
  comments: number;
  saves?: number;
}

export interface ISharedRoute {
  id: string;
  ownerId: string;
  title: string;
  summary?: string;
  cityId: string;
  cityName?: string;
  coverImageUrl?: string;
  /** Links back to the existing Vacation/Route domain (the map + guide viewer). */
  vacationId?: string;
  routeIds: string[];
  distanceKm?: number;
  durationDays?: number;
  tags?: string[];
  visibility: RouteVisibility;
  stats: ISharedRouteStats;
  createdAt: string;
}
