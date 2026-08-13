import type { IUser } from '../../domain/entities/social/User';
import type { UserRepository } from '../../domain/repositories/social/UserRepository';

export class GetCurrentUser {
  constructor(private readonly userRepository: UserRepository) {}

  execute(): IUser | null {
    return this.userRepository.getCurrent();
  }
}
