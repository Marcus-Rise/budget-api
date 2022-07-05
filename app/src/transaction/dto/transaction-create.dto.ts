import { IsDate, IsEnum, IsNotEmpty, Min } from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';
import { Transform } from 'class-transformer';

class TransactionCreateDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  category: string;

  @Min(1)
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  date: Date;
}

export { TransactionCreateDto };
