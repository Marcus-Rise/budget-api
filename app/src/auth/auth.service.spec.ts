import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

const createUser = jest.fn();

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: { create: createUser },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
});
