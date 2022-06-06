import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthRegistrationDto } from './dto/auth-registration.dto';
import { UserWithoutPassword } from './authed-user';
import { IAuthJwtPayload } from './auth-jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntityFactory } from './entities/refresh-token.entity.factory';

@Injectable()
class AuthService {
  constructor(
    private readonly _users: UserService,
    private readonly _jwt: JwtService,
    @InjectRepository(RefreshToken)
    private readonly _refreshToken: Repository<RefreshToken>,
  ) {}

  async validateUser(login: string, password: string): Promise<UserWithoutPassword | null> {
    const user = await this._users.findByPassword(password, login);

    if (!user) {
      return null;
    }

    delete user.password;

    return user;
  }

  async registerUser(dto: AuthRegistrationDto): Promise<UserWithoutPassword> {
    const user = await this._users.create({ isActive: false, ...dto });

    delete user.password;

    return user;
  }

  async generateToken(user: UserWithoutPassword) {
    const payload: IAuthJwtPayload = { username: user.login, id: user.id };

    return this._jwt.signAsync(payload, {
      subject: String(user.id),
    });
  }

  async generateRefreshToken(user: UserWithoutPassword, expiresIn: number) {
    const refreshToken = await this._refreshToken.save(
      RefreshTokenEntityFactory.create(user, expiresIn),
    );

    return this._jwt.signAsync(
      {},
      {
        expiresIn,
        subject: String(user.id),
        jwtid: String(refreshToken.id),
      },
    );
  }

  async generateAccessTokenFromRefreshToken(refreshToken: string): Promise<string> {
    return '';
  }
}

export { AuthService };
