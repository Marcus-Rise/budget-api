import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '../../user/service';
import { AuthRegistrationDto } from '../dto/auth-registration.dto';
import { AuthJwtPermissions, IAuthJwtPayload, UserWithoutPassword } from '../types';
import { JwtService } from '@nestjs/jwt';
import { LessThan, Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntityFactory } from '../entities/refresh-token.entity.factory';
import { ConfigType } from '@nestjs/config';
import { authConfig } from '../config/auth.config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService } from '../../mail/mail.service';

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

  async validateUser(login: string, password: string): Promise<UserWithoutPassword | null> {
    const user = await this._users.findByLoginPassword(password, login);

    if (!user || !user.isActive) {
      return null;
    }

    delete user.password;

    return user;
  }

  async registerUser(dto: AuthRegistrationDto): Promise<UserWithoutPassword> {
    const user = await this._users.create({ isActive: false, ...dto });

    delete user.password;

    const emailToken = await this.generateEmailToken(user);

    await this._mail.sendEmailConfirmation(user.login, emailToken);

    return user;
  }

  async activateUser(userId: number): Promise<UserWithoutPassword> {
    const user = await this._users.findOne(userId);

    if (!user) {
      throw new NotFoundException();
    }

    user.isActive = true;

    return this._users.update(user);
  }

  async generateToken(user: UserWithoutPassword) {
    const payload: IAuthJwtPayload = {
      username: user.login,
      id: user.id,
      permissions: [AuthJwtPermissions.USER],
    };

    return this._jwt.signAsync(payload, {
      subject: String(user.id),
    });
  }

  async generateEmailToken(user: UserWithoutPassword) {
    const payload: IAuthJwtPayload = {
      username: user.login,
      id: user.id,
      permissions: [AuthJwtPermissions.EMAIL],
    };

    return this._jwt.signAsync(payload, {
      subject: String(user.id),
      expiresIn: '1d',
    });
  }

  async generateRefreshToken(user: UserWithoutPassword) {
    /**
     * seconds
     */
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
}

export { AuthService };
