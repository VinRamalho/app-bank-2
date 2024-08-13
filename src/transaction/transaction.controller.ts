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

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiBearerAuth('Authorization')
  async create(
    @Body() createTransactionDto: TransactionCreateDto,
    @Request() req,
  ) {
    const { id: userId } = req.user as ITokenPayload;

    try {
      return await this.transactionService.createTransaction(
        createTransactionDto,
        userId,
      );
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Get()
  @ApiBearerAuth('Authorization')
  async findAll() {
    try {
      return await this.transactionService.find();
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Get(':id')
  @ApiBearerAuth('Authorization')
  async find(@Param('id') id: string) {
    try {
      const res = await this.transactionService.findOne({where: {id}});
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
