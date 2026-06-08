import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../../presentation/dtos/update-user.dto';
import type { UserRepositoryPort } from '../ports/user-repository.port';
import { USER_REPOSITORY_PORT } from '../ports/user-repository.port';
import { CPF } from '../../domain/value-objects/cpf.vo';
import type { StoragePort } from '../../../../shared/ports/storage.port';
import { STORAGE_PORT } from '../../../../shared/ports/storage.port';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(STORAGE_PORT)
    private readonly storage: StoragePort,
  ) { }

  async execute(id: number, dto: UpdateUserDto, file?: Express.Multer.File): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.name) {
      user.updateName(dto.name);
    }

    if (dto.cpf) {
      user.updateCpf(CPF.create(dto.cpf));
    }

    if (dto.phone) {
      user.updatePhone(dto.phone);
    }

    if (file) {
      const ext = file.originalname.split('.').pop() || 'png';
      const url = await this.storage.uploadFile(file.buffer, `users/${user.getId()}/profile.${ext}`, file.mimetype);
      user.updatePhoto(url);
    }

    if (dto.role) {
      user.updateRole(dto.role);
    }

    await this.userRepository.save(user);
  }
}
