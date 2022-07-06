import { IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

class AuthResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
  login: string;
}

export { AuthResetPasswordDto };
