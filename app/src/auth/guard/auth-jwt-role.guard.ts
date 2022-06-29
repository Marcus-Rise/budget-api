import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthJwtRole, IAuthJwtPayload } from '../types';
import { JWT_ROLE_METADATA_KEY } from '../decorators/auth.decorator';

@Injectable()
class AuthJwtRoleGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this._reflector.get<AuthJwtRole[]>(JWT_ROLE_METADATA_KEY, context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: IAuthJwtPayload }>();
    const user = request.user;

    return this.matchRoles(roles, user.roles);
  }

  matchRoles(requiredRoles: AuthJwtRole[], existingRoles: AuthJwtRole[]): boolean {
    return requiredRoles.every((roles) => existingRoles.includes(roles));
  }
}

export { AuthJwtRoleGuard };
