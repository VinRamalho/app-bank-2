import { Entity, Column, ManyToOne } from 'typeorm';
import { DataModel } from 'src/data/entities/data.entity';
import { Account } from 'src/account/entities/account.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum TransactionType {
  DEPOSIT = 0,
  TAKE = 1,
}

@Entity('transactions')
export class Transaction extends DataModel {
  @ApiProperty()
  @IsNotEmpty()
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number; // in cents

  @ApiProperty({
    description: `O tipo da transação. Pode ser um dos seguintes valores:
    - DEPOSIT (0): Representa um depósito.
    - TAKE (1): Representa uma retirada.`,
    enum: TransactionType,
    example: TransactionType.DEPOSIT, // Ajuste conforme necessário
  })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  @Column({
    type: 'numeric',
    enum: TransactionType,
  })
  type: TransactionType;

  @ManyToOne(() => Account, (Account) => Account.transactions)
  account: Account;
}
