import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionCreateDto } from '../dto/transaction-create.dto';
import { TransactionUpdateDto } from '../dto/transaction-update.dto';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../../user/service';
import { TransactionEntityFactory } from '../entities/transaction.entity.factory';

@Injectable()
class TransactionService {
  constructor(
    @InjectRepository(Transaction) private readonly _repo: Repository<Transaction>,
    private readonly _users: UserService,
  ) {}

  async create(userId: number, dto: TransactionCreateDto) {
    const user = await this._users.findOne(userId);

    if (!user) {
      throw new NotFoundException();
    }

    const transaction = TransactionEntityFactory.fromCreateDto(dto);

    transaction.user = user;

    return this._repo.save(transaction);
  }

  findAll(userId: number) {
    return this._repo.find({ relations: ['user'], where: { user: { id: userId } } });
  }

  findOne(id: number) {
    return this._repo.findOne(id);
  }

  async update(id: number, dto: TransactionUpdateDto) {
    let transaction = await this._repo.findOne(id);

    if (!transaction) {
      throw new NotFoundException();
    }

    transaction = TransactionEntityFactory.fromUpdateDto(dto, transaction);

    return this._repo.save(transaction);
  }

  remove(id: number) {
    return this._repo.delete({ id });
  }
}

export { TransactionService };
