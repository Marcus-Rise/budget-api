import { Body, Controller, Delete, Get, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdateDto } from './dto/user-update.dto';
import { AuthJwtGuard } from '../auth/guard/auth-jwt.guard';
import { IAuthJwtPayload } from '../auth/auth-jwt-payload.interface';

@Controller('/api/user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @UseGuards(AuthJwtGuard)
  @Get()
  async me(@Request() req: { user: IAuthJwtPayload }) {
    const user = await this._userService.findOne(req.user.id);

    delete user.password;

    return user;
  }

  @UseGuards(AuthJwtGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UserUpdateDto) {
    return this._userService.update(+id, updateUserDto);
  }

  @UseGuards(AuthJwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._userService.remove(+id);
  }
}
