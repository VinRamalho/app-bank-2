import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { Public } from 'src/auth/constants/constants';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permission, Role } from 'src/permission/dto/permission.dto';
import { Permissions } from 'src/permission/decorators/permission.decorator';
import { Roles } from 'src/permission/decorators/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: UserDto) {
    try {
      const res = await this.userService.create(createUserDto);

      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Get()
  @ApiBearerAuth('Authorization')
  @Permissions(Permission.READ)
  async findAll() {
    try {
      const res = await this.userService.find();

      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Get(':id')
  @ApiBearerAuth('Authorization')
  @Permissions(Permission.READ)
  async find(@Param('id') id: string) {
    try {
      const res = await this.userService.findById(id);
      if (!res) {
        throw new NotFoundException(`Not found User: ${id}`);
      }
      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Put(':id')
  @ApiBearerAuth('Authorization')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateUserDto: UserDto) {
    try {
      const res = await this.userService.update(id, updateUserDto);
      if (!res) {
        throw new NotFoundException(`Not found User: ${id}`);
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
      await this.userService.delete(id);
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }
}
