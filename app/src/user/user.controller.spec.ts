import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

const findOne = jest.fn();
const update = jest.fn();

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: { findOne, update },
        },
        UserService,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('me', () => {
    it('should return user without password', async () => {
      findOne.mockReturnValueOnce({ password: 'pas' });

      const user = await controller.me({ user: { id: 1, username: '' } });

      expect(user).not.toHaveProperty('password');
    });
  });

  describe('update', () => {
    it('should return user without password', async () => {
      update.mockReturnValueOnce({ password: 'pas' });

      const user = await controller.update('', {});

      expect(user).not.toHaveProperty('password');
    });
  });
});
