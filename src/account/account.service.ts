import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { Crud } from 'src/crud/crud.abstract';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AccountService extends Crud<Account> {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    private userService: UserService,
  ) {
    super(accountRepository);
  }

  async createAccount(
    createAccountDto: Account,
    userId: string,
  ): Promise<Account> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const accountNumber = await this.generateAccountNumber(userId);

    const account = {
      ...createAccountDto,
      user,
      accountNumber,
    };

    return await super.createData(account);
  }

  async findByUserId(userId: string): Promise<Account[]> {
    return await this.accountRepository.find({
      where: { user: { id: userId } },
    });
  }

  private async generateAccountNumber(userId: string): Promise<string> {
    const lastAccount = await this.accountRepository.find({
      where: { user: { id: userId } },
      order: { accountNumber: 'DESC' },
      take: 1,
    });

    const lastAccountNumber = lastAccount.length
      ? Number(lastAccount.at(0).accountNumber)
      : 0;
    const newAccountNumber = (lastAccountNumber + 1)
      .toString()
      .padStart(4, '0');
    return newAccountNumber;
  }
}
