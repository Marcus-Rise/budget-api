import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthRegistrationDto } from './dto/auth-registration.dto';
import { UserWithoutPassword } from './authed-user';
import { IAuthJwtPayload } from './auth-jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntityFactory } from './entities/refresh-token.entity.factory';
import { ConfigType } from '@nestjs/config';
import { authConfig } from './config/auth.config';

@Injectable()
class AuthService {
  constructor(
    private readonly _users: UserService,
    private readonly _jwt: JwtService,
    @InjectRepository(RefreshToken)
    private readonly _refreshToken: Repository<RefreshToken>,
    @Inject(authConfig.KEY)
    private readonly _config: ConfigType<typeof authConfig>,
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

  async generateRefreshToken(user: UserWithoutPassword) {
    const expiresIn = this._config.sessionTTL;

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
    const { jti: tokenId, sub: userId } = await this._jwt.verifyAsync(refreshToken);

    const token = await this._refreshToken.findOne({ id: tokenId });

    if (!token) {
      throw new UnprocessableEntityException('Refresh token not found');
    }

    const now = Date.now();

    if (token.expires.valueOf() < now) {
      await this._refreshToken.remove(token);

      throw new UnprocessableEntityException('Refresh token expired');
    }

    if (token.isRevoked) {
      await this._refreshToken.remove(token);

      throw new UnprocessableEntityException('Refresh token revoked');
    }

    const user = await this._users.findOne(userId);

    if (!user) {
      await this._refreshToken.remove(token);

      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.generateToken(user);
  }
}

export { AuthService };
