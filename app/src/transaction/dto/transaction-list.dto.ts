import { TransactionType } from '../entities/transaction.entity';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

class TransactionListDto {
  @IsOptional()
  @IsNotEmpty()
  category?: string;

  @IsOptional()
  @Transform(({ value }) => value && Number(value), { toClassOnly: true })
  @IsNumber()
  @Min(1)
  minAmount?: number;

  @IsOptional()
  @Transform(({ value }) => value && Number(value), { toClassOnly: true })
  @IsNumber()
  @Min(1)
  maxAmount?: number;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @Transform(({ value }) => value && new Date(value), { toClassOnly: true })
  @IsDate()
  minDate?: Date;

  @IsOptional()
  @Transform(({ value }) => value && new Date(value), { toClassOnly: true })
  @IsDate()
  maxDate?: Date;
}

export { TransactionListDto };
