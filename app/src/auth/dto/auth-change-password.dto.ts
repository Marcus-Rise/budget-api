import { MinLength } from 'class-validator';
import { PASSWORD_MIN_LENGTH } from './validators';

class AuthChangePasswordDto {
  @MinLength(PASSWORD_MIN_LENGTH)
  password: string;
}

export { AuthChangePasswordDto };
