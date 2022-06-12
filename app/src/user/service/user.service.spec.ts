import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { BadRequestException } from '@nestjs/common';

const saveUser = jest.fn();
const findOne = jest.fn();

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: { save: saveUser, findOne },
        },
        UserService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    saveUser.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return saved user', async () => {
      const hashedPassword = 'hashedPassword';
      service.hashPassword = jest.fn(async () => hashedPassword);
      saveUser.mockImplementationOnce((user) => user);

      const dto = { login: 'login', password: 'password', isActive: false };
      const { password, ...user } = await service.create(dto);

      expect(password).not.toEqual(dto.password);
      expect(password).toEqual(hashedPassword);
      expect(user).toMatchObject(user);
    });

    it('should prevent creating same login user', async () => {
      const dto = { isActive: false, login: 'login', password: '' };

      await service.create(dto);

      findOne.mockReturnValueOnce({});

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });
});
