import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../service';
import { UserWithoutPassword } from '../types';

@Injectable()
class AuthLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _authService: AuthService) {
    super({ usernameField: 'login' });
  }

  async validate(login: string, password: string): Promise<UserWithoutPassword> {
    const user = await this._authService.validateUser(login.toLowerCase(), password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

export { AuthLocalStrategy };
