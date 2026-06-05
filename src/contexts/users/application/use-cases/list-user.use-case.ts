import { Injectable, Inject } from '@nestjs/common';
import type { UserRepositoryPort } from '../ports/user-repository.port';
import { USER_REPOSITORY_PORT } from '../ports/user-repository.port';

@Injectable()
export class ListUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute() {
    const users = await this.userRepository.findAll();
    return users.map(user => ({
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail().getValue(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt()
    }));
  }
}
