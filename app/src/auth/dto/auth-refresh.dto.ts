import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

class AuthRefreshDto {
  @Expose({ name: 'refresh_token', toClassOnly: true })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export { AuthRefreshDto };
