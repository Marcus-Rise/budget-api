import { IsNotEmpty, MinLength } from 'class-validator';

class AuthRegistrationDto {
  @IsNotEmpty()
  @MinLength(4)
  login: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export { AuthRegistrationDto };
