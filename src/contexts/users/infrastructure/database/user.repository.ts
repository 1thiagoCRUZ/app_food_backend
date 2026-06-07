import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSchema } from './user.schema';
import { UserRepositoryPort } from '../../application/ports/user-repository.port';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { CPF } from '../../domain/value-objects/cpf.vo';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<UserSchema>,
  ) { }

  private toDomain(schema: UserSchema): User {
    return User.create({
      id: schema.id,
      name: schema.name,
      email: Email.create(schema.email),
      password: Password.create(schema.passwordHash, true),
      cpf: schema.cpf ? CPF.reconstitute(schema.cpf) : undefined,
      phone: schema.phone || undefined,
      role: schema.role,
      photo: schema.photo,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  private toSchema(user: User): UserSchema {
    const schema = new UserSchema();
    if (user.getId()) {
      schema.id = user.getId() as number;
    }
    schema.name = user.getName();
    schema.email = user.getEmail().getValue();
    schema.passwordHash = user.getPassword().getValue();
    schema.cpf = user.getCpf()?.getValue() || undefined;
    schema.phone = user.getPhone() || undefined;
    schema.role = user.getRole();
    schema.photo = user.getPhoto() || undefined;
    schema.createdAt = user.getCreatedAt();
    schema.updatedAt = user.getUpdatedAt();
    return schema;
  }

  async save(user: User): Promise<User> {
    const schema = this.toSchema(user);
    const savedSchema = await this.repository.save(schema);
    return this.toDomain(savedSchema);
  }

  async findById(id: number): Promise<User | null> {
    const schema = await this.repository.findOne({ where: { id } });
    if (!schema) return null;
    return this.toDomain(schema);
  }

  async findByEmail(email: string): Promise<User | null> {
    const schema = await this.repository.findOne({ where: { email } });
    if (!schema) return null;
    return this.toDomain(schema);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<User[]> {
    const schemas = await this.repository.find();
    return schemas.map(schema => this.toDomain(schema));
  }
}
