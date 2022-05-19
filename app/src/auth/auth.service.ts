import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { AuthRegistrationDto } from './dto/auth-registration.dto';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
class AuthService {
  constructor(private readonly _userService: UserService) {}

  async validateUser(login: string, password: string): Promise<UserWithoutPassword | null> {
    const user = await this._userService.checkPassword(password, login);

    if (!user) {
      return null;
    }

    delete user.password;

    return user;
  }

  async registerUser(dto: AuthRegistrationDto): Promise<UserWithoutPassword> {
    const user = await this._userService.create({ isActive: false, ...dto });

    delete user.password;

    return user;
  }
}

export { AuthService };
