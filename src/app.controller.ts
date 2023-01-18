import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { JuejinService } from './juejin/juejin.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly juejinSerivce: JuejinService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('juejin_cookie')
  getJuejinCookie(@Query('user') user: string, @Query('token') token: string) {
    if (token === process.env.EXTERNAL_TOKEN) {
      return this.juejinSerivce.getCookie(user);
    }
    return '';
  }
}
