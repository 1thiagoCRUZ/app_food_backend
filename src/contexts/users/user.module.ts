import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './presentation/controllers/user.controller';
import { UserFacade } from './application/user.facade';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { AuthenticateUserUseCase } from './application/use-cases/authenticate-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-caso';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { ListUserUseCase } from './application/use-cases/list-user.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { GeocodeUserAddressUseCase } from './application/use-cases/geocode-user-address.usecase';
import { AddAddressUseCase } from './application/use-cases/add-address.use-case';
import { ListAddressesUseCase } from './application/use-cases/list-addresses.use-case';
import { UserSchema } from './infrastructure/database/user.schema';
import { AdressSchema } from './infrastructure/database/address.schema';
import { UserRepository } from './infrastructure/database/user.repository';
import { BcryptHashProvider } from './infrastructure/providers/bcrypt-hash.provider';
import { USER_REPOSITORY_PORT } from './application/ports/user-repository.port';
import { HASH_PROVIDER_PORT } from './application/ports/hash.provider.port';
import { SharedModule } from '../../shared/shared.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { DeliveryModule } from '../delivery/delivery.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSchema, AdressSchema]),
    SharedModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET')!,
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRATION', '1d') as any },
      }),
    }),
    DeliveryModule,
  ],
  controllers: [UserController],
  providers: [
    UserFacade,
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ListUserUseCase,
    GetUserByIdUseCase,
    GeocodeUserAddressUseCase,
    AddAddressUseCase,
    ListAddressesUseCase,
    {
      provide: USER_REPOSITORY_PORT,
      useClass: UserRepository,
    },
    {
      provide: HASH_PROVIDER_PORT,
      useClass: BcryptHashProvider,
    },
    JwtStrategy,
  ],
  exports: [UserFacade, JwtModule],
})
export class UserModule {}

