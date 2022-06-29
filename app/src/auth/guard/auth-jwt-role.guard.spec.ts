import { AuthJwtRoleGuard } from './auth-jwt-role.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthJwtRole } from '../types';

describe('AuthJwtRoleGuard', () => {
  let guard: AuthJwtRoleGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthJwtRoleGuard],
    }).compile();

    guard = module.get<AuthJwtRoleGuard>(AuthJwtRoleGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('matchRoles', () => {
    test.each`
      required                                 | existing             | result
      ${[AuthJwtRole.USER]}                    | ${AuthJwtRole.EMAIL} | ${false}
      ${[AuthJwtRole.USER]}                    | ${AuthJwtRole.USER}  | ${true}
      ${[AuthJwtRole.USER, AuthJwtRole.EMAIL]} | ${AuthJwtRole.USER}  | ${true}
      ${[AuthJwtRole.USER, AuthJwtRole.EMAIL]} | ${AuthJwtRole.EMAIL} | ${true}
    `('$required roles should be included in $existing roles', ({ required, existing, result }) => {
      expect(guard.matchRoles(required, existing)).toBe(result);
    });
  });
});
