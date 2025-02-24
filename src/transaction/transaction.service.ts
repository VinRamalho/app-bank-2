import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
    { destination: accountNumber, amount, type }: Partial<TransactionCreateDto>,
    userId: string,
    transfer?: boolean,
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const account = await this.accountService.findOne({
      where: { accountNumber },
      relations: ['user'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const { balance, user } = account;

    if (!transfer && user.id !== userId) {
      throw new ForbiddenException(
        'You are not allowed to make this transaction',
      );
    }

    const newBalance = this.getBalance(amount, balance, type);

    // Verifica se o saldo total, incluindo o limite de crédito, é suficiente
    if (type === TransactionType.TAKE && balance + user.creditLimit < amount) {
      throw new ForbiddenException('You cannot make this transaction');
    }

    await this.create({
      amount,
      type,
      account,
    });

    await this.accountService.update(account.id, {
      balance: newBalance,
    });

    const res = await this.accountService.findOne({
      where: { id: account.id },
    });

    return {
      destination: {
        id: res.accountNumber,
        balance: res.balance,
      },
    };
  }

  async createTranfer(
    { origin, amount, destination }: TransactionCreateDto,
    userId: string,
  ) {
    const accountOrigin = await this.accountService.findOne({
      where: { accountNumber: origin },
      relations: ['user'],
    });

    if (!accountOrigin) {
      throw new NotFoundException('Origin account is not found');
    }

    const { balance: originBalance, user } = accountOrigin;

    if (user.id !== userId) {
      throw new ForbiddenException(
        'You are not allowed to make this transaction',
      );
    }

    if (originBalance < amount) {
      throw new ForbiddenException('You cannot make this transaction');
    }

    const accountDestination = await this.accountService.findOne({
      where: { accountNumber: destination },
    });

    if (!accountDestination) {
      throw new NotFoundException(
        'This transfer cannot be performed, please review the data and try again.',
      );
    }

    await this.createTransaction(
      { amount, type: TransactionType.TAKE, destination: origin },
      userId,
      true,
    );

    await this.createTransaction(
      { amount, type: TransactionType.DEPOSIT, destination },
      userId,
      true,
    );

    const res = await this.accountService.find({
      where: { accountNumber: In([origin, destination]) },
    });

    return res.map((e) =>
      e.accountNumber === origin
        ? { origin: { id: e.accountNumber, balance: e.balance } }
        : { destination: { id: e.accountNumber, balance: e.balance } },
    );
  }

  async handleTransaction(data: TransactionCreateDto, userId: string) {
    if (data.type === TransactionType.TRANSFER) {
      const res = await this.createTranfer(data, userId);

      return res;
    }

    const res = await this.createTransaction(data, userId);

    return res;
  }

  private getBalance(
    amount: number,
    balance: number,
    type: TransactionType,
  ): number {
    const types = {
      [TransactionType.DEPOSIT]: () => balance + amount,
      [TransactionType.TAKE]: () => balance - amount,
    };

    const exec = types[type];

    if (!exec) {
      throw new Error('Invalid transaction type');
    }

    return exec();
  }
}
