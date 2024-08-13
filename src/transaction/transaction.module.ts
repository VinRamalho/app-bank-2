import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/account/entities/account.entity';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account, User])],
  controllers: [TransactionController],
  providers: [TransactionService, AccountService, UserService],
  exports: [TransactionService],
})
export class TransactionModule {}
