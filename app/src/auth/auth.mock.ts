import { TestingModuleBuilder } from '@nestjs/testing';
import { AuthJwtGuard } from './guard/auth-jwt.guard';
import { ExecutionContext } from '@nestjs/common';
import { IAuthJwtPayload } from './types';
import { AuthJwtRoleGuard } from './guard/auth-jwt-role.guard';

const mockAuth = (
  jwtPayload: Partial<IAuthJwtPayload>,
  module: TestingModuleBuilder,
): TestingModuleBuilder => {
  return module
    .overrideGuard(AuthJwtGuard)
    .useValue({
      canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        request.user = jwtPayload as IAuthJwtPayload;

        return true;
      },
    } as AuthJwtGuard)
    .overrideGuard(AuthJwtRoleGuard)
    .useValue({
      canActivate() {
        return true;
      },
    } as unknown as AuthJwtRoleGuard);
};

export { mockAuth };
