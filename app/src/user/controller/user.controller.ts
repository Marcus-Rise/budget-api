import { Controller, Delete, Get, NotFoundException, Request, UseGuards } from '@nestjs/common';
import { UserService } from '../service';
import { AuthJwtGuard } from '../../auth/guard/auth-jwt.guard';
import { IAuthJwtPayload } from '../../auth/types';
import { UserGetResponseDtoFactory } from '../dto/user-get-response.dto.factory';

@Controller('/api/user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @UseGuards(AuthJwtGuard)
  @Get()
  async me(@Request() req: { user: IAuthJwtPayload }) {
    const user = await this._userService.findOne(req.user.id);

    if (!user) {
      throw new NotFoundException();
    }

    return UserGetResponseDtoFactory.fromUser(user);
  }

  @UseGuards(AuthJwtGuard)
  @Delete()
  async remove(@Request() req: { user: IAuthJwtPayload }) {
    await this._userService.remove(req.user.id);

    return {
      status: 'ok',
    };
  }
}
