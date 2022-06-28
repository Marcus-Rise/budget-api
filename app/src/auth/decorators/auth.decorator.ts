import { AuthJwtPermissions } from '../types';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthJwtGuard } from '../guard/auth-jwt.guard';
import { AuthJwtPermissionGuard } from '../guard/auth-jwt-permission.guard';

const JWT_PERMISSION_METADATA_KEY = 'permissions';

const Auth = (...permissions: AuthJwtPermissions[]) =>
  applyDecorators(
    SetMetadata(JWT_PERMISSION_METADATA_KEY, permissions),
    UseGuards(AuthJwtGuard, AuthJwtPermissionGuard),
  );

export { Auth, JWT_PERMISSION_METADATA_KEY };
