import { PartialType } from '@nestjs/mapped-types';
import { TransactionCreateDto } from './transaction-create.dto';

class TransactionUpdateDto extends PartialType(TransactionCreateDto) {}

export { TransactionUpdateDto };
