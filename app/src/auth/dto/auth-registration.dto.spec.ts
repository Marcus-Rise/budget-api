import { AuthRegistrationDto } from './auth-registration.dto';
import { validate } from 'class-validator';

describe('AuthRegistrationDto', () => {
  describe('validate', () => {
    it('login must be an email', async () => {
      const dto = new AuthRegistrationDto();
      dto.login = '';
      dto.password = ' pas swor d ';

      const errors = await validate(dto);
      const [error] = errors;

      expect(errors).toHaveLength(1);
      expect(error.property).toEqual('login');
      expect(error.constraints.isEmail).toEqual('login must be an email');
    });
  });
});
