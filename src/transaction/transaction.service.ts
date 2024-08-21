import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { Crud } from 'src/crud/crud.abstract';
import { TransactionCreateDto } from './dto/transaction.dto';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class TransactionService extends Crud<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly accountService: AccountService,
  ) {
    super(transactionRepository);
  }

  async createTransaction(
    { accountId, amount, type }: TransactionCreateDto,
    userId: string,
  ) {
    const account = await this.accountService.findOne({
      where: { id: accountId },
      relations: ['user'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const { balance, user } = account;

    if (user.id !== userId) {
      throw new ForbiddenException(
        'You are not allowed to make this transaction',
      );
    }

    const newBalance = this.getBalance(amount, balance, type);

    // Verifica se o saldo total, incluindo o limite de crédito, é suficiente
    if (balance + user.creditLimit < amount && type === TransactionType.TAKE) {
      throw new ForbiddenException('You cannot make this transaction');
    }

    await this.accountService.update(accountId, {
      balance: newBalance,
    });

    const res = await this.create({
      amount,
      type,
      account,
    });

    return res;
  }

  private getBalance(
    amount: number,
    balance: number,
    type: TransactionType,
  ): number {
    switch (type) {
      case TransactionType.DEPOSIT:
        return balance + amount;
      case TransactionType.TAKE:
        return balance - amount;
      default:
        return balance;
    }
  }
}
