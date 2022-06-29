import { IsEmail, MinLength } from 'class-validator';
import { PASSWORD_MIN_LENGTH } from './validators';

class AuthRegistrationDto {
  @IsEmail()
  login: string;

  @MinLength(PASSWORD_MIN_LENGTH)
  password: string;
}

export { AuthRegistrationDto };
