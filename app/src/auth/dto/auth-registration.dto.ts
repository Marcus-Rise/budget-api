import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { PASSWORD_MIN_LENGTH } from './validators';
import { Transform } from 'class-transformer';

class AuthRegistrationDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
  login: string;

  @MinLength(PASSWORD_MIN_LENGTH)
  password: string;
}

export { AuthRegistrationDto };
