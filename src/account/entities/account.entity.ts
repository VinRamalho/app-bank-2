import { Entity, Column, ManyToOne, OneToMany, Index } from 'typeorm';
import { DataModel } from 'src/data/entities/data.entity';
import { User } from 'src/users/entities/user.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty } from 'class-validator';

@Entity('accounts')
@Index(['accountNumber', 'user'], { unique: true }) // Cria um índice único combinado
export class Account extends DataModel {
  @ApiProperty()
  @IsEmpty()
  @Column({ name: 'account_number', unique: true })
  accountNumber: string;

  @IsNotEmpty()
  @ApiProperty()
  @Column('bigint', {
    default: 0,
    transformer: {
      to: (value: number) => Math.round(value * 100), // Convert reais to cents before saving
      from: (value: number) => value / 100, // Converts cents to reais when recovering
    },
  })
  balance: number;

  @ManyToOne(() => User, (user) => user.accounts)
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];
}
