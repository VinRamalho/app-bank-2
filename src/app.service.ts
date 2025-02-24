import { Injectable } from '@nestjs/common';
import {} from 'typeorm';
import { UserService } from './users/user.service';

@Injectable()
export class AppService {
  constructor(private readonly userService: UserService) {}

  getUp(): string {
    return 'service up!';
  }

  async reset() {
    const repository = this.userService.Repository;

    await repository.query(
      `
      DELETE FROM transactions;
      DELETE FROM accounts;
      `,
    );
  }
}
