import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service';
import { NotFoundException } from '@nestjs/common';
import type { User } from '../entities/user.entity';

const findOne = jest.fn();
const remove = jest.fn();

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: { findOne, remove },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    remove.mockReset();
    findOne.mockReset();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('me', () => {
    it('should return user dto', async () => {
      findOne.mockReturnValueOnce(<User>{ password: 'pas', login: 'l', id: 1, isActive: false });

      const user = await controller.me({ user: { id: 1, username: '' } });

      expect(user).not.toHaveProperty('password');
      expect(user).not.toHaveProperty('id');
      expect(user).not.toHaveProperty('isActive');
    });

    it('should throw not found exception', async () => {
      findOne.mockReturnValueOnce(null);

      await expect(controller.me({ user: { id: 1, username: '' } })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove user', async () => {
      await controller.remove({ user: { id: 1, username: '' } });

      expect(remove).toHaveBeenCalledTimes(1);
    });
  });
});
