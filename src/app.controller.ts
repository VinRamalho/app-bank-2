import { Controller, Get, Post } from '@nestjs/common';
import { Public } from './auth/constants/constants';
import { AppService } from './app.service';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  findAll() {
    const res = this.appService.getUp();

    return res;
  }

  @Post('reset')
  async resetAll() {
    try {
      await this.appService.reset();

      return 'ok';
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }
}
