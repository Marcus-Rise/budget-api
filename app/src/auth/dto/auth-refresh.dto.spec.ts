import { plainToClass } from 'class-transformer';
import { AuthRefreshDto } from './auth-refresh.dto';

describe('AuthRefreshDto', () => {
  describe('refreshToken', () => {
    it('should transform plain to class camel case', () => {
      const refreshToken = 'test';
      const plain = { refresh_token: refreshToken };

      const dto = plainToClass(AuthRefreshDto, plain);

      expect(dto.refreshToken).toEqual(refreshToken);
    });
  });
});
