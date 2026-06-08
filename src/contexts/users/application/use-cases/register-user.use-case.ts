import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { CPF } from '../../domain/value-objects/cpf.vo';
import { RegisterUserDto } from '../../presentation/dtos/register-user.dto';
import type { UserRepositoryPort } from '../ports/user-repository.port';
import { USER_REPOSITORY_PORT } from '../ports/user-repository.port';
import type { HashProviderPort } from '../ports/hash.provider.port';
import { HASH_PROVIDER_PORT } from '../ports/hash.provider.port';
import type { StoragePort } from '../../../../shared/ports/storage.port';
import { STORAGE_PORT } from '../../../../shared/ports/storage.port';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(HASH_PROVIDER_PORT)
    private readonly hashProvider: HashProviderPort,
    @Inject(STORAGE_PORT)
    private readonly storage: StoragePort,
  ) { }

  async execute(dto: RegisterUserDto, file?: Express.Multer.File): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const emailVo = Email.create(dto.email);
    const passwordVo = Password.create(dto.password);
    const cpfVo = CPF.create(dto.cpf);

    const hashedPassword = await this.hashProvider.hash(passwordVo.getValue());
    const hashedPasswordField = Password.create(hashedPassword, true);

    const user = User.create({
      name: dto.name,
      email: emailVo,
      password: hashedPasswordField,
      cpf: cpfVo,
      phone: dto.phone,
      role: dto.role,
    });

    const savedUser = await this.userRepository.save(user);

    if (file) {
      const ext = file.originalname.split('.').pop() || 'png';
      const url = await this.storage.uploadFile(file.buffer, `users/${savedUser.getId()}/profile.${ext}`, file.mimetype);
      savedUser.updatePhoto(url);
      await this.userRepository.save(savedUser);
    }

    return savedUser;
  }
}
