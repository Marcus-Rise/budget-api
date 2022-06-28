import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthJwtPermissions, IAuthJwtPayload } from '../types';
import { JWT_PERMISSION_METADATA_KEY } from '../decorators/auth.decorator';

@Injectable()
class AuthJwtPermissionGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const permissions = this._reflector.get<AuthJwtPermissions[]>(
      JWT_PERMISSION_METADATA_KEY,
      context.getHandler(),
    );

    if (!permissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: IAuthJwtPayload }>();
    const user = request.user;

    return this.matchPermissions(permissions, user.permissions);
  }

  matchPermissions(
    requiredPermissions: AuthJwtPermissions[],
    userPermissions: AuthJwtPermissions[],
  ): boolean {
    return requiredPermissions.every((permission) => userPermissions.includes(permission));
  }
}

export { AuthJwtPermissionGuard };
