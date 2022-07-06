import { IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

class AuthResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  login: string;
}

export { AuthResetPasswordDto };
