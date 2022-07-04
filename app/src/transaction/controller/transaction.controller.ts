import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { TransactionService } from '../service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthJwtRole, IAuthJwtPayload } from '../../auth/types';

@Controller('/api/transaction')
class TransactionController {
  constructor(private readonly _service: TransactionService) {}

  @Auth(AuthJwtRole.USER)
  @Post()
  create(@Request() req: { user: IAuthJwtPayload }, @Body() dto: CreateTransactionDto) {
    return this._service.create(req.user.id, dto);
  }

  @Auth(AuthJwtRole.USER)
  @Get()
  findAll(@Request() req: { user: IAuthJwtPayload }) {
    return this._service.findAll(req.user.id);
  }

  @Auth(AuthJwtRole.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this._service.findOne(+id);
  }

  @Auth(AuthJwtRole.USER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this._service.update(+id, dto);
  }

  @Auth(AuthJwtRole.USER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._service.remove(+id);
  }
}

export { TransactionController };