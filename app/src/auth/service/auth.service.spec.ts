import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokenEntityFactory } from '../entities/refresh-token.entity.factory';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { authConfig } from '../config/auth.config';
import { UserEntityFactory } from '../../user/entities/user.entity.factory';
import { MailService } from '../../mail/mail.service';
import { User } from '../../user/entities/user.entity';
import { AuthJwtRole } from '../types';

const createUser = jest.fn();
const findByLoginPassword = jest.fn();
const findUserById = jest.fn();
const generateJwt = jest.fn();
const verifyJwt = jest.fn();
const saveRefreshToken = jest.fn();
const findRefreshToken = jest.fn();
const removeRefreshToken = jest.fn();
const sendEmailConfirmation = jest.fn();
const updateUser = jest.fn();
const findByLogin = jest.fn();
const sendResetPassword = jest.fn();
const hashPassword = jest.fn();

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            create: createUser,
            findByLoginPassword,
            findOne: findUserById,
            update: updateUser,
            findByLogin,
            hashPassword,
          },
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: {
            save: saveRefreshToken,
            findOne: findRefreshToken,
            remove: removeRefreshToken,
          },
        },
        {
          provide: authConfig.KEY,
          useValue: {
            sessionTTL: '10000000',
            tokenTTL: '100000',
            registrationEmailTokenTTL: '10',
            resetPasswordEmailTokenTTL: '20',
          },
        },
        { provide: JwtService, useValue: { signAsync: generateJwt, verifyAsync: verifyJwt } },
        { provide: MailService, useValue: { sendEmailConfirmation, sendResetPassword } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    createUser.mockReset();
    findByLoginPassword.mockReset();
    findUserById.mockReset();
    generateJwt.mockReset();
    verifyJwt.mockReset();
    saveRefreshToken.mockReset();
    findRefreshToken.mockReset();
    removeRefreshToken.mockReset();
    sendEmailConfirmation.mockReset();
    updateUser.mockReset();
    findByLogin.mockReset();
    sendResetPassword.mockReset();
    hashPassword.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user', async () => {
      findByLoginPassword.mockReturnValueOnce(
        UserEntityFactory.fromCreateDto({ isActive: true, password: 'p', login: 'l' }),
      );

      await service.validateUser('login', 'password');
    });

    it('should return null if password is not valid', async () => {
      findByLoginPassword.mockReturnValueOnce(null);
      const res = await service.validateUser('login', 'password');

      expect(res).toBeNull();
    });

    it('should return null if user is not active', async () => {
      const user = UserEntityFactory.fromCreateDto({ isActive: false, login: 'l', password: 'p' });
      findByLoginPassword.mockReturnValueOnce(user);
      const res = await service.validateUser('login', 'password');

      expect(res).toBeNull();
    });
  });

  describe('registerUser', () => {
    it('should create inactive user and send verification email', async () => {
      const user: User = {
        isActive: false,
        password: 'password',
        id: 1,
        login: 'login',
        transactions: [],
        refreshTokens: [],
      };
      createUser.mockReturnValueOnce(user);
      const emailToken = 'token';
      service.generateToken = jest.fn(async () => emailToken);

      const dto = { login: 'login', password: 'password' };
      const { isActive, login } = await service.registerUser(dto);

      expect(service.generateToken).toHaveBeenNthCalledWith(1, user, AuthJwtRole.EMAIL, '10');
      expect(login).toEqual(dto.login);
      expect(isActive).toBeFalsy();
      expect(sendEmailConfirmation).toHaveBeenNthCalledWith(1, login, emailToken);
    });
  });

  describe('activateUser', () => {
    it('should activate user', async () => {
      findUserById.mockReturnValueOnce(<User>{ isActive: false });
      updateUser.mockImplementationOnce((user) => user);

      const { isActive } = await service.activateUser(1);

      expect(isActive).toBeTruthy();
    });

    it('should throw error if user is not exists', async () => {
      findUserById.mockReturnValueOnce(undefined);

      await expect(service.activateUser(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('resetPassword', () => {
    it('should ignore not existing user', async () => {
      findByLogin.mockReturnValueOnce(undefined);
      await service.resetPassword({ login: '' });

      expect(sendResetPassword).toHaveBeenCalledTimes(0);
    });

    it('should send reset password email if user exists', async () => {
      const user: User = {
        isActive: true,
        password: 'p',
        id: 1,
        login: 'l',
        transactions: [],
        refreshTokens: [],
      };
      findByLogin.mockReturnValueOnce(user);

      const token = 'token';
      service.generateToken = jest.fn(async () => token);
      await service.resetPassword({ login: user.login });

      expect(service.generateToken).toHaveBeenNthCalledWith(1, user, AuthJwtRole.EMAIL, '20');
      expect(sendResetPassword).toHaveBeenNthCalledWith(1, user.login, token);
    });
  });

  describe('generateToken', () => {
    it('should return generated token', async () => {
      const token = 'token';
      generateJwt.mockReturnValueOnce(token);

      const accessToken = await service.generateToken(
        { isActive: false, login: 'l', id: 1, transactions: [], refreshTokens: [] },
        AuthJwtRole.USER,
      );

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
        transactions: [],
        refreshTokens: [],
        password: '',
      });

      expect(saveRefreshToken).toHaveBeenCalledTimes(1);
      expect(refreshToken).toEqual(token);
    });
  });

  describe('generateAccessTokenFromRefreshToken', () => {
    it('should generate token', async () => {
      verifyJwt.mockReturnValueOnce({ jti: 1, sub: 1 });

      const refreshToken = RefreshTokenEntityFactory.create(
        { id: 1, login: '', isActive: true, transactions: [], refreshTokens: [], password: '' },
        '10000',
      );
      findRefreshToken.mockReturnValueOnce(refreshToken);

      const user = { id: 1 };
      findUserById.mockReturnValueOnce(user);

      service.generateToken = jest.fn();

      await service.generateAccessTokenFromRefreshToken('');

      expect(service.generateToken).toHaveBeenNthCalledWith(1, user, AuthJwtRole.USER);
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
        { id: 1, login: '', isActive: true, transactions: [], refreshTokens: [], password: '' },
        '-100',
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
        { id: 1, login: '', isActive: true, transactions: [], refreshTokens: [], password: '' },
        '1000',
      );
      refreshToken.isRevoked = true;
      findRefreshToken.mockReturnValueOnce(refreshToken);

      await expect(service.generateAccessTokenFromRefreshToken('')).rejects.toThrow(
        UnprocessableEntityException,
      );

      expect(removeRefreshToken).toHaveBeenNthCalledWith(1, refreshToken);
    });

    it('should throw error if user is not exists', async () => {
      verifyJwt.mockReturnValueOnce({ jti: 1, sub: 1 });

      const refreshToken = RefreshTokenEntityFactory.create(
        { id: 1, login: '', isActive: true, transactions: [], refreshTokens: [], password: '' },
        '1000',
      );
      findRefreshToken.mockReturnValueOnce(refreshToken);

      findUserById.mockReturnValueOnce(undefined);

      await expect(service.generateAccessTokenFromRefreshToken('')).rejects.toThrow(
        UnprocessableEntityException,
      );

      expect(removeRefreshToken).toHaveBeenNthCalledWith(1, refreshToken);
    });
  });

  describe('revokeRefreshToken', () => {
    it('should revoke token', async () => {
      verifyJwt.mockReturnValueOnce({ jti: 1 });
      const refreshToken = RefreshTokenEntityFactory.create(
        {
          isActive: false,
          login: '',
          id: 2,
          transactions: [],
          refreshTokens: [],
          password: '',
        },
        '200',
      );
      findRefreshToken.mockReturnValueOnce(refreshToken);

      await service.revokeRefreshToken('');

      expect(saveRefreshToken).toHaveBeenNthCalledWith(1, { ...refreshToken, isRevoked: true });
    });

    it('should throw error if token is not exists', async () => {
      verifyJwt.mockReturnValueOnce({ jti: 1 });
      findRefreshToken.mockReturnValueOnce(undefined);

      await expect(service.revokeRefreshToken('')).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('changeUserPassword', () => {
    it('should change password with hashed str', async () => {
      const hashedPassword = 'hashed password';

      findUserById.mockReturnValueOnce({});
      updateUser.mockImplementationOnce((user) => user);
      hashPassword.mockReturnValueOnce(hashedPassword);

      const user = await service.changeUserPassword(1, { password: 'password' });

      expect(user).toMatchObject({ password: hashedPassword });
    });

    it('should throw error if user is not exists', async () => {
      findUserById.mockReturnValueOnce(undefined);

      await expect(service.changeUserPassword(1, { password: 'password' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
