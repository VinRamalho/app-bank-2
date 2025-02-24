import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { TransactionCreateDto } from './dto/transaction.dto';
import { TransactionService } from './transaction.service';
import { ITokenPayload } from 'src/auth/dto/auth.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from 'src/permission/decorators/permission.decorator';
import { Permission } from 'src/permission/dto/permission.dto';

@Controller('event')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiBearerAuth('Authorization')
  @Permissions(Permission.CREATE)
  async create(
    @Body() createTransactionDto: TransactionCreateDto,
    @Request() req,
  ) {
    const { id: userId } = req.user as ITokenPayload;

    try {
      const res = await this.transactionService.handleTransaction(
        createTransactionDto,
        userId,
      );

      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Get()
  @ApiBearerAuth('Authorization')
  @Permissions(Permission.READ)
  async findAll() {
    try {
      const res = await this.transactionService.find();

      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Get(':id')
  @ApiBearerAuth('Authorization')
  @Permissions(Permission.READ)
  async find(@Param('id') id: string) {
    try {
      const res = await this.transactionService.findOne({ where: { id } });
      if (!res) {
        throw new NotFoundException(`Not found Transaction: ${id}`);
      }
      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }
}
