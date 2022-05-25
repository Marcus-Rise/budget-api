import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthRegistrationDto } from './dto/auth-registration.dto';
import { UserWithoutPassword } from './authed-user';
import { IAuthJwtPayload } from './auth-jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService,
  ) {}

  async validateUser(login: string, password: string): Promise<UserWithoutPassword | null> {
    const user = await this._userService.findByPassword(password, login);

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

  async generateToken(user: UserWithoutPassword) {
    const payload: IAuthJwtPayload = { username: user.login, id: user.id };

    return this._jwtService.signAsync(payload);
  }
}

export { AuthService };
