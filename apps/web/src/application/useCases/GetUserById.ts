import type { IUser } from '../../domain/entities/social/User';
import type { UserRepository } from '../../domain/repositories/social/UserRepository';

export class GetUserById {
  constructor(private readonly userRepository: UserRepository) {}

  execute(userId: string): IUser | null {
    return this.userRepository.getById(userId);
  }
}
