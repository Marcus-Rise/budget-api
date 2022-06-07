import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokenEntityFactory } from './entities/refresh-token.entity.factory';
import { UnprocessableEntityException } from '@nestjs/common';
import { authConfig } from './config/auth.config';

const createUser = jest.fn();
const findByPassword = jest.fn();
const findUserById = jest.fn();
const generateJwt = jest.fn();
const verifyJwt = jest.fn();
const saveRefreshToken = jest.fn();
const findRefreshToken = jest.fn();
const removeRefreshToken = jest.fn();

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: { create: createUser, findByPassword, findOne: findUserById },
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: {
            save: saveRefreshToken,
            findOne: findRefreshToken,
            remove: removeRefreshToken,
          },
        },
        { provide: authConfig.KEY, useValue: {} },
        { provide: JwtService, useValue: { signAsync: generateJwt, verifyAsync: verifyJwt } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    createUser.mockReset();
    findByPassword.mockReset();
    findUserById.mockReset();
    generateJwt.mockReset();
    verifyJwt.mockReset();
    saveRefreshToken.mockReset();
    findRefreshToken.mockReset();
    removeRefreshToken.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password', async () => {
      findByPassword.mockReturnValueOnce({ password: 'p' });
      const res = await service.validateUser('login', 'password');

      expect(res).not.toHaveProperty('password');
    });

    it('should return null if password is not valid', async () => {
      findByPassword.mockReturnValueOnce(null);
      const res = await service.validateUser('login', 'password');

      expect(res).toBeNull();
    });
  });

  describe('registerUser', () => {
    it('should create inactive user', async () => {
      createUser.mockImplementationOnce((user) => user);
      const dto = { login: 'login', password: 'password' };

      const { isActive, login } = await service.registerUser(dto);

      expect(login).toEqual(dto.login);
      expect(isActive).toBeFalsy();
    });
  });

  describe('generateToken', () => {
    it('should return generated token', async () => {
      const token = 'token';
      generateJwt.mockReturnValueOnce(token);

      const accessToken = await service.generateToken({ isActive: false, login: 'l', id: 1 });

      expect(accessToken).toEqual(token);
    });
  });

  describe('generateRefreshToken', () => {
    it('should return generated refresh token', async () => {
      const token = 'refresh-token';
      generateJwt.mockReturnValueOnce(token);

      saveRefreshToken.mockReturnValueOnce({
        id: 1,
      });

      const refreshToken = await service.generateRefreshToken({
        isActive: false,
        login: 'l',
        id: 1,
      });

      expect(saveRefreshToken).toHaveBeenCalledTimes(1);
      expect(refreshToken).toEqual(token);
    });
  });

  describe('generateAccessTokenFromRefreshToken', () => {
    it('should generate token', async () => {
      verifyJwt.mockReturnValueOnce({ jti: 1, sub: 1 });

      const refreshToken = RefreshTokenEntityFactory.create(
        { id: 1, login: '', isActive: true },
        10000,
      );
      findRefreshToken.mockReturnValueOnce(refreshToken);

      const user = { id: 1 };
      findUserById.mockReturnValueOnce(user);

      service.generateToken = jest.fn();

      await service.generateAccessTokenFromRefreshToken('');

      expect(service.generateToken).toHaveBeenNthCalledWith(1, user);
    });

    it('should throw error if token is not exists', async () => {
      verifyJwt.mockReturnValueOnce({ jti: 1, sub: 1 });

      findRefreshToken.mockReturnValueOnce(undefined);

      await expect(service.generateAccessTokenFromRefreshToken('')).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('should throw error if token is expired', async () => {
      verifyJwt.mockReturnValueOnce({ jti: 1, sub: 1 });

      const refreshToken = RefreshTokenEntityFactory.create(
        { id: 1, login: '', isActive: true },
        -100,
      );
      findRefreshToken.mockReturnValueOnce(refreshToken);

      await expect(service.generateAccessTokenFromRefreshToken('')).rejects.toThrow(
        UnprocessableEntityException,
      );

      expect(removeRefreshToken).toHaveBeenNthCalledWith(1, refreshToken);
    });

    it('should throw error if token is revoked', async () => {
      verifyJwt.mockReturnValueOnce({ jti: 1, sub: 1 });

      const refreshToken = RefreshTokenEntityFactory.create(
        { id: 1, login: '', isActive: true },
        1000,
      );
      refreshToken.isRevoked = true;
      findRefreshToken.mockReturnValueOnce(refreshToken);

      await expect(service.generateAccessTokenFromRefreshToken('')).rejects.toThrow(
        UnprocessableEntityException,
      );

      expect(removeRefreshToken).toHaveBeenNthCalledWith(1, refreshToken);
    });

    it('should throw error if token is revoked', async () => {
      verifyJwt.mockReturnValueOnce({ jti: 1, sub: 1 });

      const refreshToken = RefreshTokenEntityFactory.create(
        { id: 1, login: '', isActive: true },
        1000,
      );
      findRefreshToken.mockReturnValueOnce(refreshToken);

      findUserById.mockReturnValueOnce(undefined);

      await expect(service.generateAccessTokenFromRefreshToken('')).rejects.toThrow(
        UnprocessableEntityException,
      );

      expect(removeRefreshToken).toHaveBeenNthCalledWith(1, refreshToken);
    });
  });
});
