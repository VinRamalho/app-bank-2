import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';

export class AuthDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface ITokenPayload extends Pick<UserDto, 'name' | 'id' | 'roles'> {}
