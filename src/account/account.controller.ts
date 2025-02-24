import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountDto } from './dto/account.dto';
import { AccountService } from './account.service';
import { ITokenPayload } from 'src/auth/dto/auth.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permission } from 'src/permission/dto/permission.dto';
import { Permissions } from 'src/permission/decorators/permission.decorator';
import { Account } from './entities/account.entity';

@Controller('balance')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiBearerAuth('Authorization')
  @Permissions(Permission.CREATE)
  async create(@Body() createAccountDto: AccountDto, @Request() req) {
    const { id } = req.user as ITokenPayload;
    const { destination, ...rest } = createAccountDto;
    const data = { ...rest, accountNumber: destination } as Account;

    try {
      const res = await this.accountService.findOne({
        where: { accountNumber: destination },
        relations: ['user'],
      });

      if (res) {
        throw new BadRequestException(`Account ${destination} already exists`);
      }

      const { balance, accountNumber } =
        await this.accountService.createAccount(data, id);

      return { destination: { id: accountNumber, balance: balance } };
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Get()
  @ApiBearerAuth('Authorization')
  @Permissions(Permission.READ)
  async findAll(@Request() req) {
    const { id } = req.user as ITokenPayload;
    try {
      const res = await this.accountService.findByUserId(id);

      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Get(':account')
  @ApiBearerAuth('Authorization')
  @Permissions(Permission.READ)
  async find(@Param('account') account: string, @Request() req) {
    const { id: userId } = req.user as ITokenPayload;

    try {
      const res = await this.accountService.findOne({
        where: { accountNumber: account },
        relations: ['user'],
      });
      if (!res) {
        throw new NotFoundException(`Not found Account: ${account}`);
      }

      const { user, balance, accountNumber } = res;

      if (user.id !== userId) {
        throw new UnauthorizedException('Oops! you are not allowed to do this');
      }

      return {
        balance,
        accountNumber,
        username: user.username,
      };
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Put(':id')
  @ApiBearerAuth('Authorization')
  @Permissions(Permission.UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateAccountDto: AccountDto,
    @Request() req,
  ) {
    const { id: userId } = req.user as ITokenPayload;

    try {
      const account = await this.accountService.findOne({
        where: { id },
        relations: ['user'],
        select: ['user'],
      });
      if (!account) {
        throw new NotFoundException(`Not found Account: ${id}`);
      }

      const { user } = account;

      if (user.id !== userId) {
        throw new UnauthorizedException('Oops! you are not allowed to do this');
      }

      const res = await this.accountService.update(id, updateAccountDto);
      if (!res) {
        throw new NotFoundException(`Not found Account: ${id}`);
      }
      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Delete(':id')
  @ApiBearerAuth('Authorization')
  @Permissions(Permission.DELETE)
  async remove(@Param('id') id: string) {
    try {
      await this.accountService.delete(id);
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }
}
