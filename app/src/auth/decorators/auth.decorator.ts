import { AuthJwtRole } from '../types';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthJwtGuard } from '../guard/auth-jwt.guard';
import { AuthJwtRoleGuard } from '../guard/auth-jwt-role.guard';

const JWT_ROLE_METADATA_KEY = 'roles';

const Auth = (...roles: AuthJwtRole[]) =>
  applyDecorators(
    SetMetadata(JWT_ROLE_METADATA_KEY, roles),
    UseGuards(AuthJwtGuard, AuthJwtRoleGuard),
  );

export { Auth, JWT_ROLE_METADATA_KEY };
