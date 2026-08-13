import type { IUser } from '../../entities/social/User';

export interface UserRepository {
  getCurrent(): IUser | null;
  getById(userId: string): IUser | null;
}
