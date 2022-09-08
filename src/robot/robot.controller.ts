import { Body, Controller, Header, Post, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { RobotService } from './robot.service';

@Controller('robot')
@UseFilters(new HttpExceptionFilter())
@UseGuards(AuthGuard('jwt'))
export class RobotController {
  constructor(private robotService: RobotService) {}

  @Post('send')
  @UseGuards(AuthGuard('jwt'))
  send(@Body() dto: any) {
    return this.robotService.sendText(dto.value, JSON.parse(dto.mobile));
  }
}
