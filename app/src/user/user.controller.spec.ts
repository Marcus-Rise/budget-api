import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';

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
    it('should return user without password', async () => {
      findOne.mockReturnValueOnce({ password: 'pas' });

      const user = await controller.me({ user: { id: 1, username: '' } });

      expect(user).not.toHaveProperty('password');
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
