import { IsEmail, MinLength } from 'class-validator';

class AuthRegistrationDto {
  @IsEmail()
  login: string;

  @MinLength(8)
  password: string;
}

export { AuthRegistrationDto };
