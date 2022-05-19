import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_CONFIG_TOKEN, JwtConfig } from '../config/jwt.config';
import { IAuthJwtPayload } from '../auth-jwt-payload.interface';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private _config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _config.get<JwtConfig>(JWT_CONFIG_TOKEN).secret,
    });
  }

  async validate(payload: IAuthJwtPayload): Promise<IAuthJwtPayload> {
    return payload;
  }
}
