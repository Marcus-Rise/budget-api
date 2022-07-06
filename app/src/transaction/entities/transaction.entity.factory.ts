import { Transaction } from './transaction.entity';
import { TransactionCreateDto } from '../dto/transaction-create.dto';
import { TransactionUpdateDto } from '../dto/transaction-update.dto';

class TransactionEntityFactory {
  static fromCreateDto(dto: TransactionCreateDto): Transaction {
    const transaction = new Transaction();

    transaction.title = dto.title;
    transaction.type = dto.type;
    transaction.amount = dto.amount;
    transaction.category = dto.category;
    transaction.date = dto.date;

    return transaction;
  }

  static fromUpdateDto(dto: TransactionUpdateDto, transaction: Transaction): Transaction {
    transaction.title = dto.title ?? transaction.title;
    transaction.type = dto.type ?? transaction.type;
    transaction.amount = dto.amount ?? transaction.amount;
    transaction.category = dto.category ?? transaction.category;
    transaction.date = dto.date ?? transaction.date;

    return transaction;
  }
}

export { TransactionEntityFactory };
