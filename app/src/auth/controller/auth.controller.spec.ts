import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service';
import { AuthJwtRole } from '../types';

const registerUser = jest.fn();
const generateToken = jest.fn();
const generateRefreshToken = jest.fn();
const generateAccessTokenFromRefreshToken = jest.fn();
const activateUser = jest.fn();
const resetPassword = jest.fn();
const changeUserPassword = jest.fn();

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
            activateUser,
            resetPassword,
            changeUserPassword,
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    registerUser.mockReset();
    generateToken.mockReset();
    generateRefreshToken.mockReset();
    generateAccessTokenFromRefreshToken.mockReset();
    activateUser.mockReset();
    resetPassword.mockReset();
    changeUserPassword.mockReset();
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

  describe('emailConfirm', () => {
    it('should activate user', async () => {
      const userId = 1;
      await controller.emailConfirm({ user: { id: userId, role: AuthJwtRole.USER, username: '' } });

      expect(activateUser).toHaveBeenNthCalledWith(1, userId);
    });
  });

  describe('resetPassword', () => {
    it('should reset password', async () => {
      const dto = { login: 'l' };
      await controller.resetPassword(dto);

      expect(resetPassword).toHaveBeenNthCalledWith(1, dto);
    });
  });

  describe('changePassword', () => {
    it('should change password', async () => {
      const dto = { password: 'l' };
      const userId = 1;
      await controller.changePassword(
        { user: { id: userId, role: AuthJwtRole.USER, username: '' } },
        dto,
      );

      expect(changeUserPassword).toHaveBeenNthCalledWith(1, userId, dto);
    });
  });

  describe('login', () => {
    it('should return token', async () => {
      const accessToken = 'access_token';
      const refreshToken = 'refresh_token';
      generateToken.mockReturnValueOnce(accessToken);
      generateRefreshToken.mockReturnValueOnce(refreshToken);

      const { access_token, refresh_token, type } = await controller.login({
        user: {
          isActive: false,
          login: 'l',
          id: 1,
          transactions: [],
          password: '',
          refreshTokens: [],
        },
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
