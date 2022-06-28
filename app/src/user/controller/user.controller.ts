import { Controller, Delete, Get, NotFoundException, Request } from '@nestjs/common';
import { UserService } from '../service';
import { AuthJwtPermissions, IAuthJwtPayload } from '../../auth/types';
import { UserGetResponseDtoFactory } from '../dto/user-get-response.dto.factory';
import { Auth } from '../../auth/decorators/auth.decorator';

@Controller('/api/user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Auth(AuthJwtPermissions.USER)
  @Get()
  async me(@Request() req: { user: IAuthJwtPayload }) {
    const user = await this._userService.findOne(req.user.id);

    if (!user) {
      throw new NotFoundException();
    }

    return UserGetResponseDtoFactory.fromUser(user);
  }

  @Auth(AuthJwtPermissions.USER)
  @Delete()
  async remove(@Request() req: { user: IAuthJwtPayload }) {
    await this._userService.remove(req.user.id);

    return {
      status: 'ok',
    };
  }
}
