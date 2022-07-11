import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionCreateDto } from '../dto/transaction-create.dto';
import { TransactionUpdateDto } from '../dto/transaction-update.dto';
import { Between, Equal, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../../user/service';
import { TransactionEntityFactory } from '../entities/transaction.entity.factory';
import { TransactionListDto } from '../dto/transaction-list.dto';
import { FindConditions } from 'typeorm/find-options/FindConditions';

@Injectable()
class TransactionService {
  constructor(
    @InjectRepository(Transaction) private readonly _repo: Repository<Transaction>,
    private readonly _users: UserService,
  ) {}

  async create(userId: number, dto: TransactionCreateDto[]) {
    const user = await this._users.findOne(userId);

    if (!user) {
      throw new NotFoundException();
    }

    const transactions = await Promise.all(
      dto.map(async (i) => {
        const transaction = TransactionEntityFactory.fromCreateDto(i, user);

        if (!!transaction.uuid) {
          const existingTransaction = await this._repo.findOne({
            relations: ['user'],
            where: { uuid: transaction.uuid },
          });

          if (existingTransaction.user.id !== user.id) {
            throw new ForbiddenException();
          }
        }

        return transaction;
      }),
    );

    return this._repo.save(transactions);
  }

  findAll(userId: number, query: TransactionListDto) {
    const filter: FindConditions<Transaction> = {};

    if (query.minAmount !== undefined && query.maxAmount !== undefined) {
      filter.amount = Between(query.minAmount, query.maxAmount);
    } else if (query.minAmount !== undefined) {
      filter.amount = MoreThanOrEqual(query.minAmount);
    } else if (query.maxAmount !== undefined) {
      filter.amount = LessThanOrEqual(query.maxAmount);
    }

    if (!!query.category) {
      filter.category = Equal(query.category);
    }

    if (!!query.type) {
      filter.type = Equal(query.type);
    }

    if (query.minDate !== undefined && query.maxDate !== undefined) {
      filter.date = Between(query.minDate, query.maxDate);
    } else if (query.minDate !== undefined) {
      filter.date = MoreThanOrEqual(query.minDate);
    } else if (query.maxDate !== undefined) {
      filter.date = LessThanOrEqual(query.maxDate);
    }

    return this._repo.find({ relations: ['user'], where: { ...filter, user: { id: userId } } });
  }

  findOne(uuid: string) {
    return this._repo.findOne(uuid);
  }

  async update(uuid: string, dto: TransactionUpdateDto) {
    let transaction = await this._repo.findOne(uuid);

    if (!transaction) {
      throw new NotFoundException();
    }

    transaction = TransactionEntityFactory.fromUpdateDto(dto, transaction);

    return this._repo.save(transaction);
  }

  remove(uuid: string) {
    return this._repo.delete({ uuid });
  }
}

export { TransactionService };
