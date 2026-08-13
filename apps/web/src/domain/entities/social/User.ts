export interface IUserStats {
  routes: number;
  diaries: number;
  followers: number;
  following: number;
}

export interface IUser {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  joinedAt: string;
  stats?: IUserStats;
}
