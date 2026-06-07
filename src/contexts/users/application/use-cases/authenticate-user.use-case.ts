import { Injectable, Inject } from '@nestjs/common';
import { LoginDto } from '../../presentation/dtos/login.dto';
import type { UserRepositoryPort } from '../ports/user-repository.port';
import { USER_REPOSITORY_PORT } from '../ports/user-repository.port';
import type { HashProviderPort } from '../ports/hash.provider.port';
import { HASH_PROVIDER_PORT } from '../ports/hash.provider.port';
import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(HASH_PROVIDER_PORT)
    private readonly hashProvider: HashProviderPort,
    private readonly jwtService: JwtService,
  ) { }

  async execute(dto: LoginDto): Promise<{ token: string, user: any }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await this.hashProvider.compare(
      dto.password,
      user.getPassword().getValue(),
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const payload = { sub: user.getId(), email: user.getEmail().getValue(), role: user.getRole() };
    const token = this.jwtService.sign(payload);

    return { 
      token, 
      user: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail().getValue(),
        role: user.getRole(),
        photo: user.getPhoto()
      }
    };
  }
}
