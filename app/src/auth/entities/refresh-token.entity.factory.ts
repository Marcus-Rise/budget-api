import { RefreshToken } from './refresh-token.entity';
import { UserWithoutPassword } from '../authed-user';

class RefreshTokenEntityFactory {
  static create(user: UserWithoutPassword, ttl: number): RefreshToken {
    const refreshToken = new RefreshToken();

    refreshToken.userId = user.id;
    refreshToken.isRevoked = false;

    const expiration = new Date();
    expiration.setTime(expiration.getTime() + ttl);

    refreshToken.expires = expiration;

    return refreshToken;
  }
}

export { RefreshTokenEntityFactory };
