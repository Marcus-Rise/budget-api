import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthLocalGuard } from './guard/auth-local-guard';
import { AuthRegistrationDto } from './dto/auth-registration.dto';
import { AuthService } from './auth.service';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly _service: AuthService) {}

  @UseGuards(AuthLocalGuard)
  @Post('/login')
  login(@Request() req) {
    return req.user;
  }

  @Post('/register')
  register(@Body() dto: AuthRegistrationDto) {
    return this._service.registerUser(dto);
  }
}
