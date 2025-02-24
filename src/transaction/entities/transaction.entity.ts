import { Entity, Column, ManyToOne } from 'typeorm';
import { DataModel } from 'src/data/entities/data.entity';
import { Account } from 'src/account/entities/account.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum TransactionType {
  DEPOSIT = 'deposit',
  TAKE = 'withdraw',
  TRANSFER = 'transfer',
}

@Entity('transactions')
export class Transaction extends DataModel {
  @ApiProperty()
  @IsNotEmpty()
  @Column('bigint', {
    default: 0,
    transformer: {
      to: (value: number) => Math.round(value * 100), // Converte reais para centavos antes de salvar
      from: (value: number) => value / 100, // Converte centavos para reais ao recuperar
    },
  })
  amount: number; // in cents

  @ApiProperty({
    description: `O tipo da transação. Pode ser um dos seguintes valores:
    - DEPOSIT (0): Representa um depósito.
    - WITHDRAW (1): Representa uma retirada.
    - TRANSFER (2): Representa uma transferência.`,
    enum: TransactionType,
    example: TransactionType.DEPOSIT, // Ajuste conforme necessário
  })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @ManyToOne(() => Account, (Account) => Account.transactions)
  account: Account;
}
