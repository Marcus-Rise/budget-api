import { Body, Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthRegistrationDto } from './dto/auth-registration.dto';
import { AuthService } from './auth.service';
import { UserWithoutPassword } from './authed-user';
import { AuthLocalGuard } from './guard/auth-local.guard';
import { AuthJwtGuard } from './guard/auth-jwt.guard';
import { AuthRefreshDto } from './dto/auth-refresh.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly _service: AuthService) {}

  @Post('/register')
  async register(@Body() dto: AuthRegistrationDto) {
    await this._service.registerUser(dto);

    return {
      status: 'ok',
    };
  }

  @UseGuards(AuthLocalGuard)
  @Post('/login')
  @HttpCode(200)
  async login(@Request() req: { user: UserWithoutPassword }) {
    const token = await this._service.generateToken(req.user);
    const refreshToken = await this._service.generateRefreshToken(req.user);

    return { type: 'bearer', access_token: token, refresh_token: refreshToken };
  }

  @UseGuards(AuthJwtGuard)
  @Post('/refresh')
  @HttpCode(200)
  async refresh(@Body() { refreshToken }: AuthRefreshDto) {
    const token = await this._service.generateAccessTokenFromRefreshToken(refreshToken);

    return { type: 'bearer', access_token: token };
  }
}
