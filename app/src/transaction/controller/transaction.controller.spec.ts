import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from '../service';
import { IAuthJwtPayload } from '../../auth/types';
import { TransactionCreateBatchDto, TransactionCreateDto } from '../dto/transaction-create.dto';
import { TransactionUpdateDto } from '../dto/transaction-update.dto';

const create = jest.fn();
const createBatch = jest.fn();
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
            createBatch,
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
    createBatch.mockReset();
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
      const dto = {} as TransactionCreateDto;

      await controller.create({ user: { id: userId } as IAuthJwtPayload }, dto);

      expect(create).toHaveBeenNthCalledWith(1, userId, dto);
    });
  });

  describe('createBatch', () => {
    it('should create transaction as batch', async () => {
      const userId = 1;
      const dto = {} as TransactionCreateBatchDto;

      await controller.createBatch({ user: { id: userId } as IAuthJwtPayload }, dto);

      expect(createBatch).toHaveBeenNthCalledWith(1, userId, dto);
    });
  });

  describe('findAll', () => {
    it('should find all user transaction', async () => {
      const userId = 1;

      await controller.findAll({ user: { id: userId } as IAuthJwtPayload }, {});

      expect(findAll).toHaveBeenNthCalledWith(1, userId, {});
    });
  });

  describe('update', () => {
    it('should update user transaction', async () => {
      const dto = {} as TransactionUpdateDto;
      const transactionId = '1';

      await controller.update(transactionId, dto);

      expect(update).toHaveBeenNthCalledWith(1, transactionId, dto);
    });
  });

  describe('remove', () => {
    it('should delete user transaction', async () => {
      const transactionId = '1';

      await controller.remove(transactionId);

      expect(remove).toHaveBeenNthCalledWith(1, transactionId);
    });
  });
});
