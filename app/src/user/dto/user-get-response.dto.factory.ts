import type { User } from '../entities/user.entity';
import type { UserGetResponseDto } from './user-get-response.dto';

class UserGetResponseDtoFactory {
  static fromUser(user: User): UserGetResponseDto {
    return {
      login: user.login,
    };
  }
}

export { UserGetResponseDtoFactory };
