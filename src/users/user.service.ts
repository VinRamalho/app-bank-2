import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { hash, genSalt } from 'bcrypt';
import { Crud } from 'src/crud/crud.abstract';

@Injectable()
export class UserService extends Crud<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async create(createUserDto: UserDto): Promise<User> {
    const { password } = createUserDto;

    const salt = await genSalt();
    const passwordHash = await hash(password, salt);

    const user: DeepPartial<User> = {
      ...createUserDto,
      password: passwordHash,
    };

    const res = await super.createData(user);

    return res;
  }

  async findByDocument(document: string): Promise<User | undefined> {
    const res = await super.findOne({ where: { document } });

    return res;
  }

  async findById(id: string): Promise<User | undefined> {
    const res = await super.findOne({ where: { id } });

    return res;
  }
}
