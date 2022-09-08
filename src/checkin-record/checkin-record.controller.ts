import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/user/user.decorator';
import { CheckinRecord } from './checkin-record.entity';
import { CheckinRecordService } from './checkin-record.service';

@UseGuards(AuthGuard('jwt'))
@Controller('checkinrecord')
export class CheckinRecordController {
  constructor(private checkinRecordService: CheckinRecordService) {}

  @Get('data')
  getData(@AuthUser('code') code: string) {
    return this.checkinRecordService.getAllData(code);
  }

}
