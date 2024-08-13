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

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
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
  async findAll() {
    try {
      return await this.transactionService.findAll();
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    try {
      const res = await this.transactionService.findById(id);
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
