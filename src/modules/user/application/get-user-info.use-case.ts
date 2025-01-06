import { User } from '../domain/interface';
import { UserRepository } from '../infraestructure/user-repository';

export class GetUserInfoUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<User | null> {
    return await this.userRepository.getUserInfo();
  }
} 