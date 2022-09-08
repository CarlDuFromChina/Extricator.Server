import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RobotService } from './robot.service';
import { RobotController } from './robot.controller';

@Module({
  imports: [HttpModule],
  providers: [RobotService],
  exports: [RobotService],
  controllers: [RobotController]
})
export class RobotModule {}
