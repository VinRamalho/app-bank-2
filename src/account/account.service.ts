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

    const account = {
      ...createAccountDto,
      user,
    };

    const res = await super.createData(account);

    return res;
  }

  async findByUserId(userId: string): Promise<Account[]> {
    const res = await this.accountRepository.find({
      where: { user: { id: userId } },
    });

    return res;
  }
}
