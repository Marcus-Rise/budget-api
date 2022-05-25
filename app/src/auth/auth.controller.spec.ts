import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const registerUser = jest.fn();
const generateToken = jest.fn();

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: { registerUser, generateToken },
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should return ok', async () => {
      const dto = { password: '', login: '' };
      const res = await controller.register(dto);

      expect(res).toMatchObject({ status: 'ok' });
      expect(registerUser).toHaveBeenNthCalledWith(1, dto);
    });
  });

  describe('login', () => {
    it('should return token', async () => {
      const token = 'token';
      generateToken.mockReturnValueOnce(token);

      const { access_token } = await controller.login({
        user: { isActive: false, login: 'l', id: 1 },
      });

      expect(access_token).toEqual(token);
    });
  });
});
