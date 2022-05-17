import { CreateUserDto } from '../dto/create-user.dto';
import { User } from './user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

class UserEntityFactory {
  static fromCreateDto(dto: CreateUserDto): User {
    const user = new User();

    user.login = dto.login;

    return user;
  }

  static fromUpdateDto(dto: UpdateUserDto): User {
    const user = new User();

    user.login = dto.login;

    return user;
  }
}

export { UserEntityFactory };
