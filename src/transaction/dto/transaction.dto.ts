import { ApiProperty } from '@nestjs/swagger';
import { Transaction, TransactionType } from '../entities/transaction.entity';
import { IsEnum, IsNotEmpty } from 'class-validator';
import e from 'express';

export class TransactionDto extends Transaction {}

export class TransactionCreateDto extends TransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
}
