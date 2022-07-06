import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '../../user/service';
import { AuthRegistrationDto } from '../dto/auth-registration.dto';
import { AuthJwtRole, IAuthJwtPayload, UserWithoutPassword } from '../types';
import { JwtService } from '@nestjs/jwt';
import { LessThan, Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntityFactory } from '../entities/refresh-token.entity.factory';
import { ConfigType } from '@nestjs/config';
import { authConfig, SessionTTL } from '../config/auth.config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService } from '../../mail/mail.service';
import { AuthResetPasswordDto } from '../dto/auth-reset-password.dto';
import { AuthChangePasswordDto } from '../dto/auth-change-password.dto';
import { User } from '../../user/entities/user.entity';

@Injectable()
class AuthService {
  constructor(
    private readonly _users: UserService,
    private readonly _jwt: JwtService,
    @InjectRepository(RefreshToken)
    private readonly _refreshToken: Repository<RefreshToken>,
    @Inject(authConfig.KEY)
    private readonly _config: ConfigType<typeof authConfig>,
    private readonly _mail: MailService,
  ) {}

  async validateUser(login: string, password: string): Promise<User | null> {
    const user = await this._users.findByLoginPassword(password, login);

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  }

  async registerUser(dto: AuthRegistrationDto): Promise<UserWithoutPassword> {
    const user = await this._users.create({ isActive: false, ...dto });

    delete user.password;

    const emailToken = await this.generateToken(user, AuthJwtRole.EMAIL, '1d');

    await this._mail.sendEmailConfirmation(user.login, emailToken);

    return user;
  }

  async resetPassword(dto: AuthResetPasswordDto) {
    const user = await this._users.findByLogin(dto.login);

    if (user) {
      const emailToken = await this.generateToken(user, AuthJwtRole.EMAIL, '10m');

      await this._mail.sendResetPassword(user.login, emailToken);
    }
  }

  async activateUser(userId: number): Promise<UserWithoutPassword> {
    const user = await this._users.findOne(userId);

    if (!user) {
      throw new NotFoundException();
    }

    user.isActive = true;

    return this._users.update(user);
  }

  async generateToken(user: UserWithoutPassword, role: AuthJwtRole, expiresIn?: SessionTTL) {
    const payload: IAuthJwtPayload = {
      username: user.login,
      id: user.id,
      role,
    };

    return this._jwt.signAsync(payload, {
      subject: String(user.id),
      expiresIn: expiresIn ?? '60s',
    });
  }

  async generateRefreshToken(user: User) {
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

    return this.generateToken(user, AuthJwtRole.USER);
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    name: 'clear-refresh-token',
  })
  async clearRefreshToken() {
    const tokens = await this._refreshToken.find({
      where: [
        {
          expires: LessThan(new Date().toISOString()),
        },
        { isRevoked: true },
      ],
    });

    return this._refreshToken.remove(tokens);
  }

  async revokeRefreshToken(refreshToken: string) {
    const { jti: tokenId } = await this._jwt.verifyAsync(refreshToken);

    const token = await this._refreshToken.findOne({ id: tokenId });

    if (!token) {
      throw new UnprocessableEntityException('Refresh token not found');
    }

    token.isRevoked = true;

    return this._refreshToken.save(token);
  }

  async changeUserPassword(userId: number, dto: AuthChangePasswordDto) {
    const user = await this._users.findOne(userId);

    if (!user) {
      throw new NotFoundException("user didn't found");
    }

    user.password = await this._users.hashPassword(dto.password);

    return this._users.update(user);
  }
}

export { AuthService };
