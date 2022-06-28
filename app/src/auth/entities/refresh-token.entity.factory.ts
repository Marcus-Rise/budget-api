import { RefreshToken } from './refresh-token.entity';
import { UserWithoutPassword } from '../types';
import { SessionTTL } from '../config/auth.config';
import ms from 'ms';

class RefreshTokenEntityFactory {
  static create(user: UserWithoutPassword, ttl: SessionTTL): RefreshToken {
    const refreshToken = new RefreshToken();

    refreshToken.userId = user.id;
    refreshToken.isRevoked = false;

    const expiration = new Date();
    expiration.setTime(expiration.getTime() + ms(ttl));

    refreshToken.expires = expiration;

    return refreshToken;
  }
}

export { RefreshTokenEntityFactory };
