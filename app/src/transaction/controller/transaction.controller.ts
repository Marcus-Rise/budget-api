import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { TransactionService } from '../service';
import { TransactionCreateDto } from '../dto/transaction-create.dto';
import { TransactionUpdateDto } from '../dto/transaction-update.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthJwtRole, IAuthJwtPayload } from '../../auth/types';
import { TransactionListDto } from '../dto/transaction-list.dto';

@Controller('/api/transaction')
class TransactionController {
  constructor(private readonly _service: TransactionService) {}

  @Auth(AuthJwtRole.USER)
  @Post()
  create(@Request() req: { user: IAuthJwtPayload }, @Body() dto: TransactionCreateDto) {
    return this._service.create(req.user.id, dto);
  }

  @Auth(AuthJwtRole.USER)
  @Get()
  findAll(@Request() req: { user: IAuthJwtPayload }, @Query() query: TransactionListDto) {
    return this._service.findAll(req.user.id, query);
  }

  @Auth(AuthJwtRole.USER)
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this._service.findOne(uuid);
  }

  @Auth(AuthJwtRole.USER)
  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() dto: TransactionUpdateDto) {
    return this._service.update(uuid, dto);
  }

  @Auth(AuthJwtRole.USER)
  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string) {
    await this._service.remove(uuid);

    return {
      status: 'ok',
    };
  }
}

export { TransactionController };
