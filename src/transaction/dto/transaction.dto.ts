import { ApiProperty } from '@nestjs/swagger';
import { Transaction, TransactionType } from '../entities/transaction.entity';
import { IsNotEmpty, ValidateIf } from 'class-validator';

export class TransactionDto extends Transaction {}

export class TransactionCreateDto extends TransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  destination: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === TransactionType.TRANSFER)
  origin: string;
}
