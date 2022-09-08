/* juejin.controller.ts */

import { Body, Controller, Get, InternalServerErrorException, Param, Post, Put, Query, Req, UseFilters, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "src/user/user.decorator";
import { JuejinService } from "./juejin.service";
import { HttpExceptionFilter } from "src/http-exception.filter";
import { Juejin } from "./juejin.entity";

@Controller('juejin')
@UseFilters(new HttpExceptionFilter())
@UseGuards(AuthGuard('jwt'))
export class JuejinController {
  constructor(private juejinService: JuejinService) {}

  @Get('getCurPoint')
  getCurPoint(@AuthUser('code') code: string) {
    return this.juejinService.getCurPoint(code);
  }

  @Get('getTodayStatus')
  getTodayStatus(@AuthUser('code') code: string) {
    return this.juejinService.getTodayStatus(code);
  }

  @Get('getCheckinCounts')
  getCheckinCounts(@AuthUser('code') code: string) {
    return this.juejinService.getCheckinCounts(code);
  }

  @Get('getFreeTimes')
  async getFreeTimes(@AuthUser('code') code: string) {
    const lottery = await this.juejinService.getLotteryConfig(code);
    return lottery.free_count;
  }

  @Post('checkin')
  checkin(@AuthUser('code') code: string) {
    return this.juejinService.checkin(code);
  }

  @Post('dip_lucky')
  dipLucky(@AuthUser('code') code: string) {
    return this.juejinService.dipLucky(code);
  }

  @Post('draw')
  async draw(@AuthUser('code') code: string, @Query('count') count: number) {
    const resp = await this.juejinService.draw(code, count);
    var result = [];
    resp.forEach(item => {
      if (item.err_no === 0) {
        result.push(`恭喜获得${item.data.lottery_name}`);
      } else {
        throw new InternalServerErrorException(item.err_msg);
      }
    });
    return result;
  }

  @Post('allin')
  async allin(@AuthUser('code') code: string) {
    const resp = await this.juejinService.allin(code);
    if (Object.keys(resp).length === 0) {
      throw new InternalServerErrorException('你没有矿石了');
    } else {
      var result = '共计<br/>';
      for (const key in resp) {
        if (Object.prototype.hasOwnProperty.call(resp, key)) {
          const element = resp[key];
          result += `${key}：${element}<br/>`;
        }
      }
      return result;
    }
  }

  @Get('data')
  getData(@AuthUser('code') code: string) {
    return this.juejinService.getData(code);
  }

  @Post('data')
  createData(@AuthUser('code') code: string, @Body() dto: Juejin) {
    return this.juejinService.createData(dto, code);
  }

  @Put('data')
  updateData(@AuthUser('code') code: string, @Body() dto: Juejin) {
    return this.juejinService.updateData(dto, code);
  }
}