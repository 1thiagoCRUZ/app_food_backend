import { Injectable } from '@nestjs/common';
import { RegisterUserUseCase } from './use-cases/register-user.use-case';
import { AuthenticateUserUseCase } from './use-cases/authenticate-user.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-caso';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case';
import { ListUserUseCase } from './use-cases/list-user.use-case';
import { RegisterUserDto } from '../presentation/dtos/register-user.dto';
import { LoginDto } from '../presentation/dtos/login.dto';
import { UpdateUserDto } from '../presentation/dtos/update-user.dto';

@Injectable()
export class UserFacade {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly listUserUseCase: ListUserUseCase,
  ) {}

  register(dto: RegisterUserDto) {
    return this.registerUserUseCase.execute(dto);
  }

  login(dto: LoginDto) {
    return this.authenticateUserUseCase.execute(dto);
  }

  update(id: number, dto: UpdateUserDto) {
    return this.updateUserUseCase.execute(id, dto);
  }

  delete(id: number) {
    return this.deleteUserUseCase.execute(id);
  }

  list() {
    return this.listUserUseCase.execute();
  }
}