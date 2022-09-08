import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { TaskService } from './task.service';

@Controller('task')
@UseFilters(new HttpExceptionFilter())
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('checkin')
  checkin() {
    return this.taskService.checkin();
  }

  @Get('checkExpiredCookie')
  checkExpiredCookie() {
    return this.taskService.checkExpiredCookie();
  }
}
