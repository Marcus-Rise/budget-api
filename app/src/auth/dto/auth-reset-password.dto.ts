import { IsEmail } from 'class-validator';

class AuthResetPasswordDto {
  @IsEmail()
  login: string;
}

export { AuthResetPasswordDto };
