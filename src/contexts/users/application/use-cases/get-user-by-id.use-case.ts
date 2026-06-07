import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { UserRepositoryPort } from '../ports/user-repository.port';
import { USER_REPOSITORY_PORT } from '../ports/user-repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdressSchema } from '../../infrastructure/database/address.schema';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @InjectRepository(AdressSchema)
    private readonly addressRepository: Repository<AdressSchema>,
  ) {}

  async execute(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail().getValue(),
      cpf: user.getCpf()?.getFormatted(),
      phone: user.getPhone(),
      role: user.getRole(),
      photo: user.getPhoto(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
      addresses: await this.addressRepository.find({
        where: { userId: id },
        order: { isDefault: 'DESC', id: 'DESC' },
      })
    };
  }
}
