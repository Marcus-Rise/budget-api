import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

const createUser = jest.fn();
const findByPassword = jest.fn();
const generateJwt = jest.fn();

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

      const { access_token } = await service.generateToken({ isActive: false, login: 'l', id: 1 });

      expect(access_token).toEqual(token);
    });
  });
});
