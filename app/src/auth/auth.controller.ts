import { Body, Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthRegistrationDto } from './dto/auth-registration.dto';
import { AuthService } from './auth.service';
import { UserWithoutPassword } from './authed-user';
import { AuthLocalGuard } from './guard/auth-local.guard';

const REFRESH_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 2;

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly _service: AuthService) {}

  @UseGuards(AuthLocalGuard)
  @Post('/login')
  @HttpCode(200)
  async login(@Request() req: { user: UserWithoutPassword }) {
    const token = await this._service.generateToken(req.user);
    const refreshToken = await this._service.generateRefreshToken(
      req.user,
      REFRESH_TOKEN_EXPIRES_IN,
    );

    return { type: 'bearer', access_token: token, refresh_token: refreshToken };
  }

  @Post('/register')
  async register(@Body() dto: AuthRegistrationDto) {
    await this._service.registerUser(dto);

    return {
      status: 'ok',
    };
  }
}
