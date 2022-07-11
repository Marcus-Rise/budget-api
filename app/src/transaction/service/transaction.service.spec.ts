import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { UserService } from '../../user/service';
import { User } from '../../user/entities/user.entity';
import { TransactionCreateDto } from '../dto/transaction-create.dto';
import { MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { TransactionUpdateDto } from '../dto/transaction-update.dto';

const findOneUser = jest.fn();
const saveTransaction = jest.fn();
const findTransaction = jest.fn();
const findOneTransaction = jest.fn();
const removeTransaction = jest.fn();

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            save: saveTransaction,
            find: findTransaction,
            findOne: findOneTransaction,
            delete: removeTransaction,
          },
        },
        { provide: UserService, useValue: { findOne: findOneUser } },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    findOneUser.mockReset();
    saveTransaction.mockReset();
    findTransaction.mockReset();
    findOneTransaction.mockReset();
    removeTransaction.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create user transaction', async () => {
      const result = '';

      findOneUser.mockReturnValueOnce({} as User);
      saveTransaction.mockReturnValueOnce(result);

      await expect(service.create(1, [{} as TransactionCreateDto])).resolves.toEqual(result);
    });

    it('should replace user transaction if exists', async () => {
      const currentUserId = 1;
      const result = '';

      findOneUser.mockReturnValueOnce({ id: currentUserId } as User);
      findOneTransaction.mockReturnValue({ user: { id: currentUserId } } as Transaction);
      saveTransaction.mockReturnValueOnce(result);

      await expect(service.create(1, [{ uuid: 'aa' } as TransactionCreateDto])).resolves.toEqual(
        result,
      );
    });

    it('should throw error if user not exists', async () => {
      findOneUser.mockReturnValueOnce(undefined);

      await expect(service.create(1, [{} as TransactionCreateDto])).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw error if transaction user is not current user', async () => {
      const currentUserId = 1;

      findOneUser.mockReturnValueOnce({ id: currentUserId } as User);
      findOneTransaction.mockReturnValue({ user: { id: 2 } } as Transaction);

      await expect(
        service.create(currentUserId, [{ uuid: 'aa' } as TransactionCreateDto]),
      ).rejects.toThrow(MethodNotAllowedException);
    });
  });

  describe('findAll', () => {
    it('should find all user transactions', async () => {
      const result = '';
      findTransaction.mockReturnValueOnce('');

      expect(service.findAll(1, {})).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should find user transaction', async () => {
      const result = '';
      findOneTransaction.mockReturnValueOnce('');

      expect(service.findOne('1')).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should find user transaction', async () => {
      const result = '';
      removeTransaction.mockReturnValueOnce('');

      expect(service.remove('1')).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update user transaction', async () => {
      const result = '';

      findOneTransaction.mockReturnValueOnce({} as Transaction);
      saveTransaction.mockReturnValueOnce(result);

      await expect(service.update('1', {} as TransactionUpdateDto)).resolves.toEqual(result);
    });

    it('should throw error if transaction not exists', async () => {
      findOneTransaction.mockReturnValueOnce(undefined);

      await expect(service.update('1', {} as TransactionUpdateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
