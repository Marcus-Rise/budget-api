import { IsDate, IsEnum, IsNotEmpty, Min } from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

class TransactionCreateDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  category: string;

  @Min(1)
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsDate()
  date: Date;
}

export { TransactionCreateDto };
