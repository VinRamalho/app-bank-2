import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getUp(): string {
    return 'service up!';
  }
}
