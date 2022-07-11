import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';
import { Transform, Type } from 'class-transformer';

class TransactionCreateDto {
  @IsOptional()
  @IsUUID(4)
  uuid?: string;

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

class TransactionCreateBatchDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionCreateDto)
  transactions: TransactionCreateDto[];
}

export { TransactionCreateDto, TransactionCreateBatchDto };
