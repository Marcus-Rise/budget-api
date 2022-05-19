import { IsNotEmpty } from 'class-validator';

class AuthLoginDto {
  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  password: string;
}

export { AuthLoginDto };
