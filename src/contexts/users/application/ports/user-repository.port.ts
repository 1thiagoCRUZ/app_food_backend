import { User } from '../../domain/entities/user.entity';

export interface UserRepositoryPort {
  save(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  delete(id: number): Promise<void>;
  findAll(): Promise<User[]>;
}

export const USER_REPOSITORY_PORT = 'USER_REPOSITORY_PORT';