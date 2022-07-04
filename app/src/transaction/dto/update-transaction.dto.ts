import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';

class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}

export { UpdateTransactionDto };
