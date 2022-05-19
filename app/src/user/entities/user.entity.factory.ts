import { UserCreateDto } from '../dto/user-create.dto';
import { User } from './user.entity';
import { UserUpdateDto } from '../dto/user-update.dto';

class UserEntityFactory {
  static fromCreateDto(dto: UserCreateDto): User {
    const user = new User();

    user.login = dto.login;
    user.password = dto.password;
    user.isActive = dto.isActive;

    return user;
  }

  static fromUpdateDto(dto: UserUpdateDto): User {
    const user = new User();

    user.login = dto.login;

    return user;
  }
}

export { UserEntityFactory };
