import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { compare } from 'bcrypt';
import { jwtConstants } from './constants/constants';
import { UserDto } from 'src/users/dto/user.dto';
import { ITokenPayload } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.findByDocument(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  private async generateAccessToken(user: UserDto): Promise<string> {
    const { name, id, roles } = user;

    const payload: ITokenPayload = { id, name, roles };
    return this.jwtService.signAsync(payload, { expiresIn: '1h' });
  }

  private async generateRefreshToken(user: UserDto): Promise<string> {
    const { name, id, roles } = user;

    const payload: ITokenPayload = { id, name, roles };
    return this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: jwtConstants.secret,
    });
  }

  async refreshTokens(refreshToken: string): Promise<any> {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.secret,
      });

      const user = await this.userService.findByDocument(decoded.email);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = await this.generateAccessToken(user);
      const newRefreshToken = await this.generateRefreshToken(user);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
