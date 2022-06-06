import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

const createUser = jest.fn();
const findByPassword = jest.fn();
const generateJwt = jest.fn();
const saveRefreshToken = jest.fn();

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: { create: createUser, findByPassword },
        },
        { provide: getRepositoryToken(RefreshToken), useValue: { save: saveRefreshToken } },
        { provide: JwtService, useValue: { signAsync: generateJwt } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
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

      const refreshToken = await service.generateRefreshToken(
        { isActive: false, login: 'l', id: 1 },
        1,
      );

      expect(saveRefreshToken).toHaveBeenCalledTimes(1);
      expect(refreshToken).toEqual(token);
    });
  });
});
