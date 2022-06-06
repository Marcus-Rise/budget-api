import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const registerUser = jest.fn();
const generateToken = jest.fn();
const generateRefreshToken = jest.fn();
const generateAccessTokenFromRefreshToken = jest.fn();

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            registerUser,
            generateToken,
            generateRefreshToken,
            generateAccessTokenFromRefreshToken,
          },
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
      const accessToken = 'access_token';
      const refreshToken = 'refresh_token';
      generateToken.mockReturnValueOnce(accessToken);
      generateRefreshToken.mockReturnValueOnce(refreshToken);

      const { access_token, refresh_token, type } = await controller.login({
        user: { isActive: false, login: 'l', id: 1 },
      });

      expect(access_token).toEqual(accessToken);
      expect(refresh_token).toEqual(refreshToken);
      expect(type).toEqual('bearer');
    });
  });

  describe('refresh', () => {
    it('should refresh token', async () => {
      const accessToken = 'access_token';
      generateAccessTokenFromRefreshToken.mockReturnValueOnce(accessToken);

      const { access_token, type } = await controller.refresh({
        refreshToken: 'refresh_token',
      });

      expect(access_token).toEqual(accessToken);
      expect(type).toEqual('bearer');
    });
  });
});
