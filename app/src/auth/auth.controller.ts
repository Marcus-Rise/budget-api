import { Body, Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthRegistrationDto } from './dto/auth-registration.dto';
import { AuthService } from './auth.service';
import { UserWithoutPassword } from './authed-user';
import { AuthLocalGuard } from './guard/auth-local.guard';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly _service: AuthService) {}

  @UseGuards(AuthLocalGuard)
  @Post('/login')
  @HttpCode(200)
  login(@Request() req: { user: UserWithoutPassword }) {
    return this._service.generateToken(req.user);
  }

  @Post('/register')
  async register(@Body() dto: AuthRegistrationDto) {
    await this._service.registerUser(dto);

    return {
      status: 'ok',
    };
  }
}
