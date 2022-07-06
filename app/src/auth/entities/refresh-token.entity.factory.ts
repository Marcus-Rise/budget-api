import { RefreshToken } from './refresh-token.entity';
import { SessionTTL } from '../config/auth.config';
import ms from 'ms';
import { User } from '../../user/entities/user.entity';

class RefreshTokenEntityFactory {
  static create(user: User, ttl: SessionTTL): RefreshToken {
    const refreshToken = new RefreshToken();

    refreshToken.user = user;
    refreshToken.isRevoked = false;

    const expiration = new Date();
    expiration.setTime(expiration.getTime() + ms(ttl));

    refreshToken.expires = expiration;

    return refreshToken;
  }
}

export { RefreshTokenEntityFactory };
