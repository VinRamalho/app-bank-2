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
  @Column({ name: 'account_number' })
  accountNumber: string;

  @IsNotEmpty()
  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance: number;

  @ManyToOne(() => User, (user) => user.accounts)
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];
}
