import type { IUser } from '../../../domain/entities/social/User';
import type { UserRepository } from '../../../domain/repositories/social/UserRepository';
import usersData from '../../data/social/users.json';

const users = usersData as unknown as IUser[];

export class JsonUserRepository implements UserRepository {
  getCurrent(): IUser | null {
    return users[0] ?? null;
  }

  getById(userId: string): IUser | null {
    return users.find((user) => user.id === userId) ?? null;
  }
}
