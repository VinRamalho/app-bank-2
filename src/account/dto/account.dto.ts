import { ApiProperty } from '@nestjs/swagger';
import { Account } from '../entities/account.entity';
import { IsNotEmpty } from 'class-validator';

export class AccountDto extends Account {
  @ApiProperty()
  @IsNotEmpty()
  destination: string;
}
