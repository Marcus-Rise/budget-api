import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from '../service';
import { IAuthJwtPayload } from '../../auth/types';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

const create = jest.fn();
const findAll = jest.fn();
const findOne = jest.fn();
const update = jest.fn();
const remove = jest.fn();

describe('TransactionController', () => {
  let controller: TransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            create,
            findAll,
            findOne,
            update,
            remove,
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  afterEach(() => {
    create.mockReset();
    findAll.mockReset();
    findOne.mockReset();
    update.mockReset();
    remove.mockReset();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create transaction', async () => {
      const userId = 1;
      const dto = {} as CreateTransactionDto;

      await controller.create({ user: { id: userId } as IAuthJwtPayload }, dto);

      expect(create).toHaveBeenNthCalledWith(1, userId, dto);
    });
  });

  describe('findAll', () => {
    it('should find all user transaction', async () => {
      const userId = 1;

      await controller.findAll({ user: { id: userId } as IAuthJwtPayload });

      expect(findAll).toHaveBeenNthCalledWith(1, userId);
    });
  });

  describe('update', () => {
    it('should update user transaction', async () => {
      const dto = {} as UpdateTransactionDto;

      await controller.update('1', dto);

      expect(update).toHaveBeenNthCalledWith(1, 1, dto);
    });
  });

  describe('remove', () => {
    it('should delete user transaction', async () => {
      await controller.remove('1');

      expect(remove).toHaveBeenNthCalledWith(1, 1);
    });
  });
});
